import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Project} from '../dto/project';
import {AppConstants} from '../util/app-constants';


@Injectable()
export class ProjectService {

  allProjects: Project[] = [];
  currentProject: Project;

  @Output() changeProjectList: EventEmitter<Project[]> = new EventEmitter();
  @Output() changeCurrentProject: EventEmitter<Project> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  onGetCurrentProject(projectId: number) { // to be changed to getAllProjectsByUserId
    this.getProjectById(projectId)
      .subscribe(project => {
          this.currentProject = project;
          this.changeCurrentProject.emit(this.currentProject);
        }
      );
  }

  getProjectById(projectId: number): Observable<Project> {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Project>(AppConstants.PROJECT_URL + '/' + projectId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onGetAllProjects(brief: string) { // to be changed to getAllProjectsByUserId
    this.getAllProjects(brief)
      .subscribe(
        (projects) => {
          this.allProjects = projects;
          this.changeProjectList.emit(this.allProjects);
        },
        (error) => console.log(error)
      );
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

  onCreateProject(project: Project) {
    this.createProject(project)
      .subscribe(
        (response) => {
          this.allProjects.push(response);
          this.changeProjectList.emit(this.allProjects);
        },
        (error) => console.log(error)
      );
  }

  createProject(project: Project) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Project>(AppConstants.PROJECT_URL, project, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onUpdateProject(project: Project) {
    this.updateProject(project)
      .subscribe(
        (response) => {
          console.log('Project was updated');
        },
        (error) => console.log(error)
      );
  }

  updateProject(project: Project) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Project>(AppConstants.PROJECT_URL, project, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onCurrentProjectChange(project: Project) {
    this.currentProject.id = project.id;
    this.currentProject.title = project.title;
    this.changeCurrentProject.emit(this.currentProject);
  }

  onDeleteProject(project: Project) {
    this.deleteProject(project.id).subscribe(
      (response) => {
        if (response == null) {
          console.log('Project was removed.');
          this.allProjects.splice(this.allProjects.indexOf(project), 1);
          this.changeProjectList.emit(this.allProjects);
        }
      },
      (error) => console.log(error)
    );
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
