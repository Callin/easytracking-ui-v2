import {User} from './user';
import {UserStory} from "./user-story";

export class Task {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: number;
  estimation: number;
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

  static getBlankTask(): Task {
    return new Task(
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
