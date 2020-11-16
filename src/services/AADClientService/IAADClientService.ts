import { AadHttpClient } from "@microsoft/sp-http";

export interface IAADClientService {
    GetAADClient(appId: string): Promise<AadHttpClient>;
}