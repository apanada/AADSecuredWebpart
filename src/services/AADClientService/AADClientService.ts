import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IAADClientService } from ".";
import { AadHttpClient } from "@microsoft/sp-http";

export class AADClientService implements IAADClientService {
    private context: WebPartContext = undefined;

    constructor(context: WebPartContext) {
        this.context = context;
    }

    public GetAADClient = (appId: string): Promise<AadHttpClient> => {
        var aadClient: AadHttpClient;

        return new Promise<AadHttpClient>(
            (resolve: (aadClient: AadHttpClient) => void, reject: (error: any) => void): void => {
                this.context.aadHttpClientFactory
                    .getClient(appId)
                    .then(
                        (client: AadHttpClient): void => {
                            aadClient = client;
                            resolve(aadClient);
                        },
                        (err) => reject(err)
                    );
            }
        );
    }
}