import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserStory} from "../dto/user-story";
import {AppConstants} from "../util/app-constants";


@Injectable()
export class UserStoryService {

  constructor(private httpClient: HttpClient) {
  }

  getUserStories(projectId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<UserStory[]>(AppConstants.USER_STORY_URL + '/projectid/' + projectId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  createUserStory(userStory: UserStory) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<UserStory>(AppConstants.USER_STORY_URL, userStory, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  updateUserStory(userStory: UserStory) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<UserStory>(AppConstants.USER_STORY_URL, userStory, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  deleteUserStory(userStoryId: number) {
    return this.httpClient.delete(AppConstants.USER_STORY_URL + '/' + userStoryId)
      .map((response) => {
        return response;
      })
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
