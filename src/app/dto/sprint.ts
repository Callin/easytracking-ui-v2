import {Project} from './project';

export class Sprint {

  id: number;
  startDate: Date;
  endDate: Date;
  sprintNumber: number;
  project: Project;


  constructor(id: number, startDate: Date, endDate: Date, sprintNumber: number, project: Project) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.sprintNumber = sprintNumber;
    this.project = project;
  }
}
