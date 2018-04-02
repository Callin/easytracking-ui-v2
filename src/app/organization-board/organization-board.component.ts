import {Component, OnInit} from '@angular/core';
import {Project} from "../dto/project";
import {MatDialog} from "@angular/material";
import {UserService} from "../service/user-service";
import {ProjectService} from "../service/project-service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../dto/user";
import {ProjectDialogComponent} from "../project-dialog/project-dialog.component";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {RemoveItemDialogComponent} from "../remove-item-dialog/remove-item-dialog.component";

@Component({
  selector: 'app-organization-board',
  templateUrl: './organization-board.component.html',
  styleUrls: ['./organization-board.component.css']
})
export class OrganizationBoardComponent implements OnInit {

  projectList: Project[] = [];
  userList: User[] = [];

  REMOVE_PROJECT: string = "project";
  REMOVE_USER: string = "user";

  constructor(public dialog: MatDialog,
              private projectService: ProjectService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.projectService.changeProjectList.subscribe(projectList => {
      this.projectList = projectList;
    });

    this.projectService.onGetAllProjects('true');

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

        this.projectService.onCreateProject(project);
      }
    });
  }

  openNewUserDialog() {
    // show predefined data

    let userForm: FormGroup = this.formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.email)
    });

    const isNew = true;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '60%',
      height: '40%',
      minHeight: 350, // assumes px
      data: {
        userForm,
        isNew
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        let user: User = User.getBlankUser();
        user.name = result.userForm.controls['name'].value;
        user.email = result.userForm.controls['email'].value;

        this.userService.onCreateUser(user);
      }
    });
  }

  openRemoveItemDialog(id: number, name: string, type: string) {
    // show predefined data

    const dialogRef = this.dialog.open(RemoveItemDialogComponent, {
      width: '30%',
      height: '20%',
      minHeight: 170, // assumes px
      data: {
        name,
        type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        if (type === this.REMOVE_PROJECT) {
          this.projectService.onDeleteProject(id);
        } else if (type === this.REMOVE_USER) {
          this.userService.onDeleteUser(id);
        }
      }
    });
  }
}
