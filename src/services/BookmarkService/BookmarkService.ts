import { AadHttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';
import { Bookmark } from "../../models/Bookmark";
import { IBookmarkService } from ".";

export class BookmarkService implements IBookmarkService {
    private readonly bookmarksClient: AadHttpClient = undefined;

    constructor(client: AadHttpClient) {
        this.bookmarksClient = client;
    }

    public GetBookmarks = async (): Promise<Bookmark[]> => {
        const apiUrl: string = "https://bookmarks-dev.azurewebsites.net/api/GetBookmarks?code=KLofLip41yhwRGLh52q9sabeoi7nJxpKVZ9Ds3OSQwtWJFPaV5mqyw==";

        // Get the response
        const response: HttpClientResponse = await this.bookmarksClient
            .get(apiUrl, AadHttpClient.configurations.v1);

        // Read the value from the JSON
        const bookmarks: any = await response.json();

        // Return the value
        return bookmarks.map(
            (bookmark: any) => ({ Id: bookmark.id, Url: bookmark.url })
        );
    }

    public GetBookmarksById = async (id: string): Promise<Bookmark> => {
        const apiUrl: string = `https://bookmarks-dev.azurewebsites.net/api/GetBookmarks/${id}?code=4anZC7EuJ4NCIZS4BNDSazGFaBpDHTFkYTcQZvMQHFfagsfsqan2kA==`;

        // Get the response
        const response: HttpClientResponse = await this.bookmarksClient
            .get(apiUrl, AadHttpClient.configurations.v1);

        // Read the value from the JSON
        const bookmark: any = await response.json();

        // Return the value
        return <Bookmark>{ Id: bookmark.id, Url: bookmark.url };
    }

    public AddBookmark = async (bookmark: Bookmark): Promise<string> => {
        const apiUrl: string = "https://bookmarks-dev.azurewebsites.net/api/AddBookmark?code=LoHqdQaRLf2mlYjf4L81jf1l4gwrnMkOivr6IrJs5Wi3Qs82GoOadw==";

        // Setup the options with header and body
        const headers: Headers = new Headers();
        headers.append("Content-type", "application/json");

        const newBookmark: any = {
            id: bookmark.Id,
            url: bookmark.Url
        };

        const postOptions: IHttpClientOptions = {
            headers: headers,
            body: JSON.stringify(newBookmark)
        };

        // Get the response
        const response: any = await this.bookmarksClient
            .post(apiUrl, AadHttpClient.configurations.v1, postOptions);

        // Read the value from the response
        const responseText: string = await response.text();

        return responseText;
    }
}