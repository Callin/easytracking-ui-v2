import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Project} from '../dto/project';
import {User} from '../dto/user';
import {Sprint} from '../dto/sprint';
import {AppConstants} from '../util/app-constants';


@Injectable()
export class SprintService {

  allProjects: Project[] = [];
  allSprints: Sprint[] = [];
  currentProject: Project;

  // @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();
  @Output() changeProjectList: EventEmitter<Project[]> = new EventEmitter();
  @Output() changeCurrentProject: EventEmitter<Project> = new EventEmitter();
  @Output() changeSprintList: EventEmitter<Sprint[]> = new EventEmitter();
  @Output() changeUserList: EventEmitter<User[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }


}
