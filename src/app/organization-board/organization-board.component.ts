import {Component, Inject, OnInit} from '@angular/core';
import {Project} from '../dto/project';
import {MatDialog} from '@angular/material';
import {UserService} from '../service/user-service';
import {ProjectService} from '../service/project-service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../dto/user';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {UserDialogComponent} from '../user-dialog/user-dialog.component';
import {RemoveItemDialogComponent} from '../remove-item-dialog/remove-item-dialog.component';
import {ProjectUsersDialogComponent} from '../project-users-dialog/project-users-dialog.component';
import {Organization} from '../dto/organization';
import {OrganizationService} from '../service/organization-service';
import {LOCAL_STORAGE_SERVICE, LocalStorageService} from '../service/local-storage-service';
import {isNullOrUndefined} from 'util';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-organization-board',
  templateUrl: './organization-board.component.html',
  styleUrls: ['./organization-board.component.css']
})
export class OrganizationBoardComponent implements OnInit {

  projectList: Project[] = [];
  userList: User[] = [];
  organization: Organization;

  REMOVE_PROJECT: string = 'project';
  REMOVE_USER: string = 'user';

  constructor(public dialog: MatDialog,
              private organizationService: OrganizationService,
              private projectService: ProjectService,
              private userService: UserService,
              private toastr: ToastrService,
              @Inject(LOCAL_STORAGE_SERVICE) public localStorage: LocalStorageService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.projectService.getAllProjectsByOrganizationId(this.localStorage.get('organizationId')).subscribe(
      (projects) => this.projectList = projects,
      (error) => console.log(error));

    this.userService.getAllUsersByOrganizationId(this.localStorage.get('organizationId')).subscribe(
      (users) => this.userList = users,
      (error) => console.log(error));

    this.organizationService.getOrganization(this.localStorage.get('organizationId'), 'true').subscribe(
      (organization) => this.organization = organization,
      (error) => console.log(error));
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

        project.organization = this.organization;

        this.projectService.createProject(project).subscribe(
          (response) => {
            this.toastr.success(project.title+ ' was created', 'Project add');
            this.projectList.push(response);},
          (error) => {
            this.toastr.error('Project was not created', 'Project add failed');
            console.log(error);
          });
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

        project.organization = this.organization;

        project.userList.forEach(user => user.organization = this.organization);

        this.projectService.updateProject(project).subscribe(
          (response) => this.toastr.success(project.title+ ' was updated', 'Project update'),
          (error) => {
            this.toastr.error(project.title + ' was not updated', 'Project update failed');
            console.log(error);
          });
      }
    });
  }

  openNewUserDialog(userList: User[]) {
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

        user.organization = this.organization;

        this.userService.createUser(user).subscribe(
          (response) => {
            userList.push(response);
            this.toastr.success(user.name + ' was created', 'User add');
          },
              (error) => {
                this.toastr.error('User was not created', 'User add failed');
                console.log(error)
              });
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

        user.organization = this.organization;

        this.userService.updateUser(user).subscribe(
          (response) =>  this.toastr.success(user.name + ' was updated', 'User update'),
          (error) => {
            this.toastr.error(user.name + ' was not updated', 'User update failed');
            console.log(error);
          });
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
                this.toastr.success(name + ' project was removed', 'Project removed');
              }
            },
            (error) => {
              this.toastr.error(name + ' was not removed', 'Project removal failed');
              console.log(error);});
        } else if (type === this.REMOVE_USER) {
          this.userService.deleteUser(id)
            .subscribe((response) => {
                if (response == null) {
                  const indexOfUser = this.userList.findIndex(user => user.id === id);
                  this.userList.splice(indexOfUser, 1);
                  this.toastr.success(name + ' user was removed', 'User removed');
                }
              },
              (error) => {
                this.toastr.error(name + ' was not removed', 'User removal failed');
                console.log(error);});
        }
      }
    });
  }

  openEditProjectUsersDialog(project: Project) {
    // show predefined data
    let userFormControlGroup: FormGroup = this.formBuilder.group({
      'userFormArray': new FormArray([])
    });
    const userFormArray = userFormControlGroup.get('userFormArray') as FormArray;
    let users = this.userList;
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
        project.userList = users.filter((user, i) => userFormControlGroup.value.userFormArray[i] === true);
        project.organization = this.organization;
        project.userList.forEach(user => user.organization = this.organization);

        this.projectService.updateProject(project).subscribe(
          (response) =>  this.toastr.success(project.title + ' was updated', 'Project update'),
          (error) => {
            this.toastr.error(name + ' was not updated', 'Project update failed');
            console.log(error);});
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

  isNull(item: any){
    return isNullOrUndefined(item)
  }
}
