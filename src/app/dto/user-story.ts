import {Project} from './project';
import {User} from './user';
import {Task} from "./task";
import {Bug} from "./bug";
import {Sprint} from "./sprint";

export class UserStory {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: number;
  estimation: number;
  user: User;
  project: Project;
  tasks: Task[];
  bugs: Bug[];
  sprint: Sprint;

  constructor(id: number,
              name: string,
              description: string,
              status: string,
              priority: number,
              estimation: number,
              user: User,
              project: Project,
              sprint: Sprint,
              tasks: Task[],
              bugs: Bug[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.estimation = estimation;
    this.user = user;
    this.project = project;
    this.sprint = sprint;
    this.tasks = tasks;
    this.bugs = bugs;
  }

  static getBlankUserStory(): UserStory {
    return new UserStory(
      null,
      null,
      null,
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
