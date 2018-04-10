import {Component, OnInit} from '@angular/core';
import {Project} from '../dto/project';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {User} from '../dto/user';
import {MatDialog} from '@angular/material';
import {ProjectService} from '../service/project-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../service/user-service";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  allUserList: User[] = [];

  allProjects: Project[] = [];

  currentProject: Project;
  allUsers: User[] = [];

  constructor(public dialog: MatDialog,
              private projectBoardService: ProjectService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // this.projectBoardService.changeProjectList.subscribe(projectList => {
    //   this.allProjects = projectList;
    // });
    //
    // this.projectBoardService.changeCurrentProject.subscribe(project => {
    //   this.currentProject = project;
    // });

    this.projectBoardService.getAllProjects("true")
      .subscribe(
        (projects) => {
          this.allProjects = projects;
          // this.changeProjectList.emit(this.allProjects);
        },
        (error) => console.log(error)
      );

    this.userService.getAllUsers()
      .subscribe(response => {
          this.allUsers = response;
          // this.changeUserList.emit(this.allUsers);
        }
      );
  }

  changeCurrentProject(project: Project) {
    this.currentProject = project;
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

        this.projectBoardService.createProject(project)
          .subscribe(
            (response) => {
              this.allProjects.push(response);
              // this.changeProjectList.emit(this.allProjects);
            },
            (error) => console.log(error)
          );
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
