import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from '../util/app-constants';
import {UserStory} from '../dto/user-story';
import {Bug} from '../dto/bug';
import {UserStoryService} from './user-story-service';


@Injectable()
export class BugService {

  userStories: UserStory[] = [];

  @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();

  constructor(private httpClient: HttpClient,
              private userStoryService: UserStoryService) {

    this.userStoryService.changeUserStoryList.subscribe(userStories => {
      this.userStories = userStories;
    });
  }

  onCreateBug(bug: Bug, userStory: UserStory) {
    this.createBug(bug)
      .subscribe(
        (response) => {
          if (response !== null) {
            userStory.bugs.push(response);
          }
        },
        (error) => console.log(error)
      );
  }

  createBug(bug: Bug) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Bug>(AppConstants.BUG_URL, bug, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onUpdateBug(bug: Bug) {
    this.updateBug(bug)
      .subscribe((response) => {
          if (response != null) {
            console.log('Bug with id: ' + bug.id + ' has been updated ');
          }
        },
        (error) => console.log(error)
      );
  }

  updateBug(bug: Bug) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Bug>(AppConstants.BUG_URL, bug, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onDeleteBug(bugId: number, userStoryId: number) {
    this.deleteBug(bugId)
      .subscribe((response) => {
          if (response == null) {
            console.log('Bug was removed.');
            const bugList = this.userStories.find(userStory => userStory.id === userStoryId).bugs;
            const indexOfBug = bugList.findIndex(bug => bug.id === bugId);
            bugList.splice(indexOfBug, 1);
            this.changeUserStoryList.emit(this.userStories);
          }
        },
        (error) => console.log(error));
  }

  deleteBug(bugId: number) {
    return this.httpClient.delete(AppConstants.BUG_URL + '/' + bugId)
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
