import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from '../util/app-constants';
import {Task} from '../dto/task';
import {UserStory} from '../dto/user-story';
import {UserStoryService} from './user-story-service';


@Injectable()
export class TaskService {

  userStories: UserStory[] = [];

  @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();

  constructor(private httpClient: HttpClient,
              private userStoryService: UserStoryService) {

    this.userStoryService.changeUserStoryList.subscribe(userStories => {
      this.userStories = userStories;
    });
  }

  onCreateTask(task: Task, userStory: UserStory) {
    this.createTask(task)
      .subscribe((response) => {
          if (response !== null) {
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
            let task: Task = Task.getBlankTask();
            task.id = taskId;

            const taskList = this.userStories.find(userStory => userStory.id === userStoryid).tasks;
            taskList.splice(taskList.indexOf(task), 1);
            this.changeUserStoryList.emit(this.userStories);
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
