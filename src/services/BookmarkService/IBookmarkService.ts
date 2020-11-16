import { Bookmark } from "../../models/Bookmark";

export interface IBookmarkService {
    AddBookmark(bookmark: Bookmark): Promise<string>;
    GetBookmarks(): Promise<Bookmark[]>;
    GetBookmarksById(id: string): Promise<Bookmark>;
}