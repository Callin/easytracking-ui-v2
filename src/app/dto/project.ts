
import {User} from './user';

export class Project {

  id: number;

  name: string;

  description: string;

  userList: User[];


  constructor(id: number, name: string, description: string, userList: User[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userList = userList;
  }

  static getBlankProject(): Project {
    return new Project(
      null,
      null,
      null,
      null);
  }
}
