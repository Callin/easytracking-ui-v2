import {User} from '../dto/user';
import {AppConstants} from "../util/app-constants";

export class BoardFilterContainer {
  user: User;

  constructor() {
    // default value
    this.user = new User(AppConstants.ALL_ID, 'All', null);
  }
}
