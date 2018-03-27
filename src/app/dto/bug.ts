import {User} from './user';
import {UserStory} from "./user-story";

export class Bug {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: number;
  estimation: number; // missing on the back end
  userStory: UserStory;
  user: User;

  constructor(id: number,
              name: string,
              priority: number,
              estimation: number,
              description: string,
              status: string,
              userStory: UserStory,
              user: User) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.estimation = estimation;
    this.description = description;
    this.status = status;
    this.userStory = userStory;
    this.user = user;
  }

  static getBlankBug(): Bug {
    return new Bug(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null);
  }
}
