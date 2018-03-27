import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../dto/project';
import {User} from '../dto/user';
import {Sprint} from '../dto/sprint';
import {AppConstants} from '../util/app-constants';
import {Task} from '../dto/task';
import {UserStory} from '../dto/user-story';


@Injectable()
export class TaskService {

  allUserStories: UserStory[] = [];

  @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  onCreateTask(task: Task, userStory: UserStory) {
    this.createTask(task)
      .subscribe((response) => {
          if (response == null) {
            userStory.tasks.push(response);
          }
        },
        (error) => console.log(error)
      );
  }

  createTask(task: Task) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Task>(AppConstants.TASK_URL, task, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onUpdateTask(task: Task) {
    this.updateTask(task)
      .subscribe((response) => {
          if (response != null) {
            console.log('Task with id: ' + task.id + ' has been updated ');
          }
        },
        (error) => console.log(error)
      );
  }

  updateTask(task: Task) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Task>(AppConstants.TASK_URL, task, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onDeleteTask(taskId: number, userStoryid: number) {
    this.deleteTask(taskId)
      .subscribe((response) => {
          if (response == null) {
            console.log('Task was removed.');
            const taskList = this.allUserStories.find(userStory => userStory.id === userStoryid).tasks;
            taskList.splice(taskList.indexOf(taskId), 1);
            this.changeUserStoryList.emit(this.allUserStories);
          }
        },
        (error) => console.log(error)
      );
  }

  deleteTask(taskId: number) {
    return this.httpClient.delete(AppConstants.TASK_URL + '/' + taskId)
      .map((response) => {
        return response;
      })
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

}
