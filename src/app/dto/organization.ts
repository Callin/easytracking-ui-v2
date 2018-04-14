import {User} from './user';
import {Project} from "./project";

export class Organization {

  id: number;

  name: string;

  userList: User[];

  administratorList: User[];

  projectList: Project[];


  constructor(id: number,
              name: string,
              userList: User[],
              administratorList: User[],
              projectList: Project[]) {
    this.id = id;
    this.name = name;
    this.userList = userList;
    this.administratorList = administratorList;
    this.projectList = projectList;
  }

  static getBlankOrganization(): Organization {
    return new Organization(
      null,
      null,
      null,
      null,
      null);
  }
}
