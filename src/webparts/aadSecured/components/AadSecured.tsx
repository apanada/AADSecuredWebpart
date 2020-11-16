import * as React from 'react';
import styles from './AadSecured.module.scss';
import { IAadSecuredProps } from './IAadSecuredProps';
import { Spinner, PrimaryButton, Label, TextField } from 'office-ui-fabric-react'; import { Bookmark } from '../../../models/Bookmark';

import { BookmarkService, IBookmarkService } from '../../../services/BookmarkService';

export interface IAadSecuredState {
  bookmarkName: string;
  bookmarkUrl: string;
  bookmarks: Bookmark[];
  isLoading: boolean;
}

export default class AadSecured extends React.Component<IAadSecuredProps, IAadSecuredState> {
  private bookmarkService: IBookmarkService;

  constructor(props: IAadSecuredProps) {
    super(props);

    this.state = {
      bookmarkName: "",
      bookmarkUrl: "",
      bookmarks: [] as Bookmark[],
      isLoading: false,
    };
  }

  public async componentDidMount() {
    // Get the analysis service
    this.bookmarkService = new BookmarkService(this.props.bookmarksClient);

    const bookmarks: Bookmark[] = await this._getBookmarks();
    this.setState({
      bookmarks: bookmarks
    });
  }

  public render(): React.ReactElement<IAadSecuredProps> {
    const { isLoading, bookmarks, bookmarkName, bookmarkUrl } = this.state;
    return (
      <div className={styles.aadSecured} >
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Label>Get all bookmarks from azure functions api</Label>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <TextField
                placeholder={"Enter Bookmark Name"}
                resizable={false}
                onChanged={(text) => this.setState({ bookmarkName: text })}
              />
              <TextField
                placeholder={"Enter Bookmark Url"}
                resizable={false}
                onChanged={(text) => this.setState({ bookmarkUrl: text })}
              />
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              <PrimaryButton
                data-automation-id="test"
                disabled={!(bookmarkName.length > 0 && bookmarkUrl.length > 0)}
                text="Add Bookmark"
                onClick={this._addBookmark.bind(this)}
              />
              <PrimaryButton
                data-automation-id="getById"
                disabled={!(bookmarkName.length > 0)}
                text="Get Bookmark"
                onClick={this._getBookmarkById.bind(this)}
              />
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
              {bookmarks.length == 0 && isLoading &&
                <Spinner></Spinner>
              }
              <ul>
                {bookmarks && bookmarks.length > 0 && bookmarks.map(bookmark =>
                  <>
                    <li>
                      {bookmark.Id}
                    </li>
                    <li>
                      {bookmark.Url}
                    </li>
                  </>
                )
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private async _getBookmarks(): Promise<Bookmark[]> {
    this.setState({ isLoading: true });
    let bookmarks: Bookmark[] = [];

    try {
      bookmarks = await this.bookmarkService.GetBookmarks();
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }

    return bookmarks;
  }

  private async _getBookmarkById(): Promise<Bookmark> {
    this.setState({ isLoading: true });
    let bookmark: Bookmark = {};

    try {
      bookmark = await this.bookmarkService.GetBookmarksById(this.state.bookmarkName);
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }

    return bookmark;
  }

  private async _addBookmark(): Promise<void> {
    this.setState({ isLoading: true });
    let addedBookmark: string = undefined;

    try {
      const bookmark: Bookmark = { Id: this.state.bookmarkName, Url: this.state.bookmarkUrl };
      addedBookmark = await this.bookmarkService.AddBookmark(bookmark);
      this.setState({ isLoading: false });

      if (addedBookmark !== null && addedBookmark !== undefined && addedBookmark !== "Bookmark already exists.") {
        this.state.bookmarks.push(bookmark);
        this.setState({
          bookmarks: this.state.bookmarks
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }
  }
}
