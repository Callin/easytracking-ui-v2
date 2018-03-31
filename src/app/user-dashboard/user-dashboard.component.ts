import {Component, OnInit} from '@angular/core';
import {Project} from '../dto/project';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {User} from '../dto/user';
import {MatDialog} from '@angular/material';
import {ProjectService} from '../service/project-service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {UserService} from "../service/user-service";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  allUserList: User[] = [new User(1, 'Dragos', 'dragos@sabau.com'),
    new User(2, 'Bogdan', 'bogdan@sabau.com'), new User(3, 'David', 'david@art.com')];

  allProjects: Project[] = [];

  currentProject: Project;
  allUsers: User[] = [];

  constructor(public dialog: MatDialog,
              private projectBoardService: ProjectService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.projectBoardService.changeProjectList.subscribe(projectList => {
      this.allProjects = projectList;
    });

    this.projectBoardService.changeCurrentProject.subscribe(project => {
      this.currentProject = project;
    });

    this.projectBoardService.onGetAllProjects('true');

    this.userService.changeUserList.subscribe(userList => {
      this.allUsers = userList;
    });

    this.userService.onGetAllUsers();
  }

  changeCurrentProject(project: Project) {
    this.currentProject = project;
    this.projectBoardService.onCurrentProjectChange(project);
  }

  openNewProjectDialog() {
    // show predefined data

    let projectForm: FormGroup = this.formBuilder.group({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'users': new FormControl()
  });

    const isNew = true;
    const allTheUsers: User[] = this.getExistingUsers();
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      height: '40%',
      minHeight: 350, // assumes px
      data: {
        projectForm,
        isNew,
        allTheUsers}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        let project: Project = Project.getBlankProject();
        project.title = result.projectForm.controls['title'].value;
        project.description = result.projectForm.controls['description'].value;
        project.userList = result.projectForm.controls['users'].value;


        // project.userList = (<FormArray>result.projectForm.get('users')).value;

        // result.projectForm.users.value.forEach(userForm => {
        //   let user: User = User.getBlankUser();
        //   user.id = userForm.value.id;
        //   user.name = userForm.value.name;
        //   project.userList.push(user);
        // });

        this.projectBoardService.onCreateProject(project);
      }
    });

  }

  getExistingUsers(): User[] {
    const allUsers: User[] = [];

    this.allUserList.forEach(user => {
      if (user.id !== -1) {
        allUsers.push(user);
      }
    });

    return allUsers;
  }
}
