
import {User} from './user';
import {Sprint} from './sprint';

export class Project {

  id: number;

  name: string;

  description: string;

  userList: User[];

  sprintList: Sprint[];


  constructor(id: number, name: string, description: string, userList: User[], sprintList: Sprint[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userList = userList;
    this.sprintList = sprintList;
  }

  static getBlankProject(): Project {
    return new Project(
      null,
      null,
      null,
      null,
      null);
  }
}
