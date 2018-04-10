import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from '../util/app-constants';
import {Task} from '../dto/task';


@Injectable()
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  createTask(task: Task) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Task>(AppConstants.TASK_URL, task, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  updateTask(task: Task) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Task>(AppConstants.TASK_URL, task, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
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
