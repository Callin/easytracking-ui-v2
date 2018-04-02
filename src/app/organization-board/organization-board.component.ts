import { Component, OnInit } from '@angular/core';
import {Project} from "../dto/project";
import {MatDialog} from "@angular/material";
import {UserService} from "../service/user-service";
import {ProjectService} from "../service/project-service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../dto/user";
import {ProjectDialogComponent} from "../project-dialog/project-dialog.component";

@Component({
  selector: 'app-organization-board',
  templateUrl: './organization-board.component.html',
  styleUrls: ['./organization-board.component.css']
})
export class OrganizationBoardComponent implements OnInit {

  projectList: Project[] = [];
  userList: User[] = [];

  constructor(public dialog: MatDialog,
              private projectBoardService: ProjectService,
              private userService: UserService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.projectBoardService.changeProjectList.subscribe(projectList => {
      this.projectList = projectList;
    });

    this.projectBoardService.onGetAllProjects('true');

    this.userService.changeUserList.subscribe(userList => {
      this.userList = userList;
    });

    this.userService.onGetAllUsers();
  }

  openNewProjectDialog() {
    // show predefined data

    let projectForm: FormGroup = this.formBuilder.group({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'users': new FormControl()
    });

    const isNew = true;
    const allTheUsers: User[] = this.userList;
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      height: '40%',
      minHeight: 350, // assumes px
      data: {
        projectForm,
        isNew,
        allTheUsers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        let project: Project = Project.getBlankProject();
        project.title = result.projectForm.controls['title'].value;
        project.description = result.projectForm.controls['description'].value;
        project.userList = result.projectForm.controls['users'].value;

        this.projectBoardService.onCreateProject(project);
      }
    });
  }

  openNewUserDialog(){}
}
