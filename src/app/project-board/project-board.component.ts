import { Component, OnInit } from '@angular/core';
import {ProjectBoardService} from "./project-board-service";
import {Project} from "../dto/project";

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css']
})
export class ProjectBoardComponent implements OnInit {

  allProjects: Project[] = [];
  currentProject: Project;

  constructor(private projectBoardService: ProjectBoardService) { }

  ngOnInit() {
    this.projectBoardService.changeProjectList.subscribe(projectList => {
      this.allProjects = projectList;
    });

    this.projectBoardService.changeCurrentProject.subscribe(project => {
      this.currentProject = project;
    });
  }

}
