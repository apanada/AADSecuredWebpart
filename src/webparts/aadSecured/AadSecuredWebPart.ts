import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { Logger, LogLevel } from "@pnp/logging";

import * as strings from "AadSecuredWebPartStrings";
import AadSecured from "./components/AadSecured";
import { IAadSecuredProps } from "./components/IAadSecuredProps";
import * as myLibrary from 'corporate-library';

export interface IAadSecuredWebPartProps {
  description: string;
}

export default class AadSecuredWebPart extends BaseClientSideWebPart<
  IAadSecuredWebPartProps
  > {
  private bookmarkService: myLibrary.IBookmarkService;

  protected async onInit(): Promise<void> {
    // Get the bookmarks service
    this.bookmarkService = new myLibrary.BookmarkService(this.context);

    Logger.subscribe(
      new myLibrary.AILogListener(
        AZURE_APPINSIGHTS_INSTRUMENTATIONKEY,
        this.context.pageContext.user.email,
        WEBPART_NAME,
        WEBPART_VERSION
      )
    );
    if (DEBUG) {
      Logger.activeLogLevel = LogLevel.Verbose;
    } else {
      Logger.activeLogLevel = LogLevel.Info;
    }

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
        bookmarkService: this.bookmarkService
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
