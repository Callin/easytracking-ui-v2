import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from "../util/app-constants";
import {Sprint} from "../dto/sprint";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SprintService {

  constructor(private httpClient: HttpClient) {
  }


  createSprint(sprint: Sprint) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Sprint>(AppConstants.SPRINT_URL, sprint, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getSprintsByProjectId(projectId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Sprint[]>(AppConstants.SPRINT_URL + '/project/' + projectId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  delete(sprintId: number) {
    return this.httpClient.delete(AppConstants.SPRINT_URL + '/' + sprintId)
      .map((response) => {
        return response;
      })
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
