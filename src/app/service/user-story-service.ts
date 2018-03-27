import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../dto/project';
import {User} from '../dto/user';
import {Sprint} from '../dto/sprint';
import {UserStory} from "../dto/user-story";
import {AppConstants} from "../util/app-constants";


@Injectable()
export class UserStoryService {

  userStories: UserStory[];

  @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  onGetUserStories(projectId: number) {
    this.getUserStories(projectId)
      .subscribe(response => {
          this.userStories = response;
          this.changeUserStoryList.emit(this.userStories);
        }
      );
  }

  getUserStories(projectId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<UserStory[]>(AppConstants.USER_STORY_URL + '/projectid/' + projectId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onCreateUserStory(userStory: UserStory) {
    this.createUserStory(userStory)
      .subscribe((response) => {
          if (response == null) {
            this.userStories.push(response);
            this.changeUserStoryList.emit(this.userStories);
          }
        },
        (error) => console.log(error)
      );
  }

  createUserStory(userStory: UserStory) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<UserStory>(AppConstants.USER_STORY_URL, userStory, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onUpdateUserStory(userStory: UserStory) {
    this.updateUserStory(userStory)
      .subscribe((response) => {
          if (response != null) {
            console.log('User story with id: ' + userStory.id + ' has been updated ');
          }
        },
        (error) => console.log(error)
      );
  }

  updateUserStory(userStory: UserStory) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<UserStory>(AppConstants.USER_STORY_URL, userStory, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onDeleteUserStory(userStoryId: number) {
    this.deleteUserStory(userStoryId)
      .subscribe((response) => {
          if (response == null) {
            let userStory: UserStory = UserStory.getBlankUserStory();
            userStory.id = userStoryId;
            console.log('User story was removed.');
            this.userStories.splice(this.userStories.indexOf(userStory), 1);
            this.changeUserStoryList.emit(this.userStories);
          }
        },
        (error) => console.log(error)
      );
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
