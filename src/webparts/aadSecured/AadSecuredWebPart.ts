import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { AadHttpClient } from "@microsoft/sp-http";

import * as strings from "AadSecuredWebPartStrings";
import AadSecured from "./components/AadSecured";
import { IAadSecuredProps } from "./components/IAadSecuredProps";
import { AADClientService, IAADClientService } from "../../services/AADClientService";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";
import { AILogListener } from "../../services/AILogListener/AILogListener";

export interface IAadSecuredWebPartProps {
  description: string;
}

export default class AadSecuredWebPart extends BaseClientSideWebPart<
  IAadSecuredWebPartProps
  > {
  private _client: AadHttpClient = undefined;

  protected async onInit(): Promise<void> {
    let aadClientService: IAADClientService = new AADClientService(this.context);
    this._client = await aadClientService.GetAADClient("b964e2a6-c547-42e9-a745-1208bdec3fb9");

    Logger.subscribe(new ConsoleListener());
    Logger.subscribe(new AILogListener(this.context.pageContext.user.email));
    if (DEBUG)
      Logger.activeLogLevel = LogLevel.Verbose;

    return Promise.resolve<void>();
  }

  public render(): void {
    Logger.log({
      message: "Inside AadSecuredWebPart - render()",
      level: LogLevel.Info,
      data: "No Issue Found"
    });

    Logger.write("This information triggerd from react component", LogLevel.Info);
    Logger.write("This warning triggerd from react component", LogLevel.Warning);
    Logger.write("This error triggerd from react component", LogLevel.Error);
    Logger.writeJSON({ FirstName: "Ajit", LastName: "Panada" }, LogLevel.Info);

    const element: React.ReactElement<IAadSecuredProps> = React.createElement(
      AadSecured,
      {
        context: this.context,
        bookmarksClient: this._client
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // @ts-ignore
  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
              groupName: strings.BasicGroupName,
            },
          ],
          header: {
            description: strings.PropertyPaneDescription,
          },
        },
      ],
    };
  }
}
