import { Component, OnInit } from '@angular/core';
import {Project} from '../dto/project';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {User} from '../dto/user';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  allUserList: User[] = [new User(1, 'Dragos', 'dragos@sabau.com'),
    new User(2, 'Bogdan', 'bogdan@sabau.com'), new User(3, 'David', 'david@art.com')];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openNewProjectDialog(){
    // show predefined data
    const project = Project.getBlankProject();
    const isNew = true;
    const allUsers: User[] = this.getExistingUsers();
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      height: '40%',
      // minHeight: 550, // assumes px
      data: {project, isNew, allUsers}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        // this.allUserStories = [];
        // result.project.userList = result.allUsers;
        // this.onCreateProject(result.project);
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
