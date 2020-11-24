import { LogLevel, ILogListener, ILogEntry } from "@pnp/logging";
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

import { _logEventFormat, _logMessageFormat } from "./Utils/Utilities";
import { CONST } from "./Utils/Constants";

export class AILogListener implements ILogListener {
    private static _instrumentationKey: string;
    private static _appInsightsInstance: ApplicationInsights;
    private static _reactPluginInstance: ReactPlugin;

    constructor(currentUser: string) {
        AILogListener._instrumentationKey = AZURE_APPINSIGHTS_INSTRUMENTATIONKEY;
        if (!AILogListener._appInsightsInstance) {
            AILogListener._appInsightsInstance = AILogListener.initializeApplicationInsights(currentUser);
        }
    }

    private static initializeApplicationInsights = (currentUser?: string): ApplicationInsights => {
        if (!AILogListener._instrumentationKey) {
            throw new Error('Instrumentation key not provided');
        }

        const browserHistory = createBrowserHistory({ basename: '' });
        AILogListener._reactPluginInstance = new ReactPlugin();
        const appInsights = new ApplicationInsights({
            config: {
                maxBatchInterval: 0,
                instrumentationKey: AILogListener._instrumentationKey,
                namePrefix: WEBPART_NAME,           // Used as Postfix for cookie and localStorage 
                disableFetchTracking: false,        // To avoid tracking on all fetch
                disableAjaxTracking: true,          // Not to autocollect Ajax calls
                autoTrackPageVisitTime: true,
                extensions: [AILogListener._reactPluginInstance],
                extensionConfig: {
                    [AILogListener._reactPluginInstance.identifier]: { history: browserHistory }
                }
            }
        });

        appInsights.loadAppInsights();
        appInsights.context.application.ver = WEBPART_VERSION; // application_Version
        appInsights.setAuthenticatedUserContext(_hashUser(currentUser)); // user_AuthenticateId
        return appInsights;
    }

    public static getReactPluginInstance(): ReactPlugin {
        if (!AILogListener._reactPluginInstance) {
            AILogListener._reactPluginInstance = new ReactPlugin();
        }
        return AILogListener._reactPluginInstance;
    }

    public static getAppInsights(): ApplicationInsights {
        if (!AILogListener._appInsightsInstance) {
            AILogListener._appInsightsInstance = AILogListener.initializeApplicationInsights();
        }
        return AILogListener._appInsightsInstance;
    }

    public trackEvent(name: string): void {
        if (AILogListener._appInsightsInstance)
            AILogListener._appInsightsInstance.trackEvent(
                _logEventFormat("custom event"),
                CONST.ApplicationInsights.CustomProps
            );
    }

    public log(entry: ILogEntry): void {
        const msg = _logMessageFormat(entry);
        if (entry.level === LogLevel.Off) {
            // No log required since the level is Off
            return;
        }

        if (AILogListener._appInsightsInstance)
            switch (entry.level) {
                case LogLevel.Verbose:
                    AILogListener._appInsightsInstance.trackTrace({ message: msg, severityLevel: SeverityLevel.Verbose }, CONST.ApplicationInsights.CustomProps);
                    break;
                case LogLevel.Info:
                    AILogListener._appInsightsInstance.trackTrace({ message: msg, severityLevel: SeverityLevel.Information }, CONST.ApplicationInsights.CustomProps);
                    console.log({ ...CONST.ApplicationInsights.CustomProps, Message: msg });
                    break;
                case LogLevel.Warning:
                    AILogListener._appInsightsInstance.trackTrace({ message: msg, severityLevel: SeverityLevel.Warning }, CONST.ApplicationInsights.CustomProps);
                    console.warn({ ...CONST.ApplicationInsights.CustomProps, Message: msg });
                    break;
                case LogLevel.Error:
                    AILogListener._appInsightsInstance.trackException({ exception: new Error(msg), severityLevel: SeverityLevel.Error, properties: CONST.ApplicationInsights.CustomProps });
                    console.error({ ...CONST.ApplicationInsights.CustomProps, Message: msg });
                    break;
            }
    }
}

export default (Component: any) =>
    withAITracking(AILogListener.getReactPluginInstance(), Component);