
import {User} from './user';
import {Sprint} from './sprint';
import {UserStory} from "./user-story";
import {Organization} from "./organization";

export class Project {

  id: number;

  title: string;

  description: string;

  userList: User[];

  sprintList: Sprint[];

  userStoryList: UserStory[];

  organization: Organization;


  constructor(id: number, title: string, description: string, userList: User[], sprintList: Sprint[], userStoryList: UserStory[], organization: Organization) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.userList = userList;
    this.sprintList = sprintList;
    this.userStoryList = userStoryList;
    this.organization = organization;
  }

  static getBlankProject(): Project {
    return new Project(
      null,
      null,
      null,
      null,
      null,
      null,
      null);
  }
}
