import {AppConstants} from "../util/app-constants";

export class User {
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static getBlankUser(): User {
    return new User(null, null, null);
  }

  static getAllUser(): User {
    return new User(AppConstants.ALL_ID, 'All', null);
  }
}
