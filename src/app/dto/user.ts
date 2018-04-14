import {AppConstants} from "../util/app-constants";
import {Organization} from "./organization";

export class User {
  id: number;
  name: string;
  email: string;
  organization: Organization;

  constructor(id: number, name: string, email: string, organization: Organization ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.organization = organization;
  }

  static getBlankUser(): User {
    return new User(null, null, null, null);
  }

  static getAllUser(): User {
    return new User(AppConstants.ALL_ID, 'All', null, null);
  }
}
