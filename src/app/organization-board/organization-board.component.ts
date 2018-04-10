import {Component, OnInit} from '@angular/core';
import {Project} from "../dto/project";
import {MatDialog} from "@angular/material";
import {UserService} from "../service/user-service";
import {ProjectService} from "../service/project-service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../dto/user";
import {ProjectDialogComponent} from "../project-dialog/project-dialog.component";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {RemoveItemDialogComponent} from "../remove-item-dialog/remove-item-dialog.component";
import {ProjectUsersDialogComponent} from "../project-users-dialog/project-users-dialog.component";

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
    this.projectService.getAllProjects("false").subscribe(
      (projects) => this.projectList = projects,
      (error) => console.log(error));

    this.userService.getAllUsers().subscribe(
      response => this.userList = response);
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
    let projectUsers: User[] = [];
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      height: '40%',
      minHeight: 350, // assumes px
      data: {
        projectForm,
        isNew,
        allTheUsers,
        projectUsers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        let project: Project = Project.getBlankProject();
        project.title = result.projectForm.controls['title'].value;
        project.description = result.projectForm.controls['description'].value;
        project.userList = result.projectUsers;

        this.projectService.createProject(project).subscribe(
          (response) => this.projectList.push(response),
          (error) => console.log(error));
      }
    });
  }

  openEditProjectDialog(project: Project) {
    // show predefined data
    let projectForm: FormGroup = this.formBuilder.group({
      'title': new FormControl(project.title, Validators.required),
      'description': new FormControl(project.description, null)
    });

    const allTheUsers: User[] = this.userList;
    let projectUsers: User[] = project.userList;

    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      minWidth: '60%',
      minHeight: '40%',
      data: {
        projectForm,
        allTheUsers,
        projectUsers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        project.title = result.projectForm.controls['title'].value;
        project.description = result.projectForm.controls['description'].value;
        project.userList = result.projectUsers;

        console.log("projectUsers:" + result.projectUsers.length);

        this.projectService.updateProject(project).subscribe(
          (response) => console.log('Project was updated'),
          (error) => console.log(error));
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
      minWidth: '60%',
      minHeight: '40%',
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

        this.userService.createUser(user).subscribe(
          (response) => this.userList.push(response),
          (error) => console.log(error));
      }
    });
  }

  openEditUserDialog(user: User) {
    // show predefined data

    let userForm: FormGroup = this.formBuilder.group({
      'name': new FormControl(user.name, Validators.required),
      'email': new FormControl(user.email, Validators.email)
    });

    const isNew = true;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      minWidth: '60%',
      minHeight: '40%',
      data: {
        userForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        user.name = result.userForm.controls['name'].value;
        user.email = result.userForm.controls['email'].value;

        this.userService.updateUser(user).subscribe(
          (response) => console.log('User with id: ' + user.id + ' has been updated '),
          (error) => console.log(error));
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
          this.projectService.deleteProject(id).subscribe(
            (response) => {
              if (response == null) {
                const indexOfProject = this.projectList.findIndex(project => project.id === id);
                this.projectList.splice(indexOfProject, 1);
                console.log('Project was removed.');
              }
            },
            (error) => console.log(error));
        } else if (type === this.REMOVE_USER) {
          this.userService.deleteUser(id)
            .subscribe((response) => {
                if (response == null) {
                  const indexOfUser = this.userList.findIndex(user => user.id === id);
                  this.userList.splice(indexOfUser, 1);
                  console.log('User was removed.');
                }
              },
              (error) => console.log(error));
        }
      }
    });
  }

  openEditProjectUsersDialog(project: Project) {
    // show predefined data
    const users = this.userList;console.log("list user: " + this.userList.length);
    let userFormControlGroup: FormGroup = this.formBuilder.group({
      'userFormArray': new FormArray([])
    });
    const userFormArray = userFormControlGroup.get('userFormArray') as FormArray;
    users.forEach(user => userFormArray.push(new FormControl(this.isPartOfTheProject(user, project))));

    const dialogRef = this.dialog.open(ProjectUsersDialogComponent, {
      width: '25%',
      height: '70%',
      data: {
        userFormControlGroup,
        users,
        project
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        const resultUSerList = users.filter((user, i) => userFormControlGroup.value.userFormArray[i] === true);

        console.log("resultUSerList" + resultUSerList.length);
        project.userList = resultUSerList;
        this.projectService.updateProject(project).subscribe(
          (response) => console.log('Project was updated'),
          (error) => console.log(error));
      }
    });
  }

  isPartOfTheProject(user: User, project: Project): boolean {
    if (project !== null && project.userList !== null) {
      const userIndex = project.userList.findIndex(projectUser => projectUser.id === user.id);
      return userIndex !== -1;
    }

    return false;
  }
}
