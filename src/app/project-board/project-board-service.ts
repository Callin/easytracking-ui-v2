import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../dto/project';
import {User} from '../dto/user';
import {Sprint} from '../dto/sprint';


@Injectable()
export class ProjectBoardService {
  serverUrl = 'http://localhost:4200/api';
  userStoryUrl = this.serverUrl + '/userstory';
  projectUrl = this.serverUrl + '/project';
  sprintUrl = this.serverUrl + '/sprint';
  taskUrl = this.serverUrl + '/task';
  bugUrl = this.serverUrl + '/bug';
  userUrl = this.serverUrl + '/user';

  // allUserStoryList: UserStory[] = [];
  allProjects: Project[] = [];
  allSprints: Sprint[] = [];
  allUsers: User[] = [];

  // @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();
  @Output() changeProjectList: EventEmitter<Project[]> = new EventEmitter();
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
    return this.httpClient.get<Project[]>(this.projectUrl + '/all', {headers: header})
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
    return this.httpClient.post<Project>(this.projectUrl, project, {headers: header})
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
}
