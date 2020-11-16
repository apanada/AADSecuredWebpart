import { AadHttpClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAadSecuredProps {
  context: WebPartContext;
  bookmarksClient: AadHttpClient;
}
