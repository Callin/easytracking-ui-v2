import {Project} from './project';

export class UserStory {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: number;
  estimation: number;
  project: Project;


  constructor(id: number, name: string, description: string, status: string, priority: number, estimation: number, project: Project) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.estimation = estimation;
    this.project = project;
  }
}
