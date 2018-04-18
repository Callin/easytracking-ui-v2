import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Project} from '../dto/project';
import {AppConstants} from '../util/app-constants';


@Injectable()
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getProjectById(projectId: number): Observable<Project> {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Project>(AppConstants.PROJECT_URL + '/' + projectId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getProjectByOrganizationId(organizationId: number): Observable<Project> {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Project[]>(AppConstants.PROJECT_URL + '/organization/' + organizationId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getAllProjects(brief: string) { // to be changed to getAllProjectsByUserId
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    let params = new HttpParams();
    params = params.append('brief', brief);
    return this.httpClient.get<Project[]>(AppConstants.PROJECT_URL + '/all', {headers: header, params: params})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getAllProjectsByOrganizationId(organizationId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Project[]>(AppConstants.PROJECT_URL + '/organization/' + organizationId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  createProject(project: Project) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Project>(AppConstants.PROJECT_URL, project, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  updateProject(project: Project) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Project>(AppConstants.PROJECT_URL, project, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  deleteProject(projectId: number) {
    return this.httpClient.delete(AppConstants.PROJECT_URL + '/' + projectId)
      .map((response) => {
        return response;
      })
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
