import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../dto/project';
import {User} from '../dto/user';
import {Sprint} from '../dto/sprint';
import {AppConstants} from "../util/app-constants";


@Injectable()
export class ProjectBoardService {

  // allUserStoryList: UserStory[] = [];
  allProjects: Project[] = [];
  allSprints: Sprint[] = [];
  allUsers: User[] = [];
  currentProject: Project;

  // @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();
  @Output() changeProjectList: EventEmitter<Project[]> = new EventEmitter();
  @Output() changeCurrentProject: EventEmitter<Project> = new EventEmitter();
  @Output() changeSprintList: EventEmitter<Sprint[]> = new EventEmitter();
  @Output() changeUserList: EventEmitter<User[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  onGetAllProjects() { // to be changed to getAllProjectsByUserId
    this.getAllProjects()
      .subscribe(
        (projects) => {
          this.allProjects = projects;
          this.changeProjectList.emit(this.allProjects);
        },
        (error) => console.log(error)
      );
  }

  getAllProjects() { // to be changed to getAllProjectsByUserId
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Project[]>(AppConstants.PROJECT_URL + '/all', {headers: header})
      .map(
        (projects) => {
          return projects;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw(error);
        }
      );
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
      .map(
        (projectResponse) => {
          return projectResponse;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw(error);
        }
      );
  }

  onGetCurrentProject(projectId: number) { // to be changed to getAllProjectsByUserId
    this.getCurrentProject(projectId)
      .subscribe(
        (project) => {
          this.currentProject = project;
          this.changeCurrentProject.emit(this.currentProject);
        },
        (error) => console.log(error)
      );
  }

  getCurrentProject(projectId: number) { // to be changed to getAllProjectsByUserId
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Project>(AppConstants.PROJECT_URL + '/' + projectId, {headers: header})
      .map(
        (projects) => {
          return projects;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw(error);
        }
      );
  }

  onCurrentProjectChange(project: Project) {
    this.currentProject.id = project.id;
    this.currentProject.name = project.name;
    this.changeCurrentProject.emit(this.currentProject);
  }
}
