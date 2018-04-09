import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {User} from "../dto/user";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ProjectUsersDialogComponent} from "../project-users-dialog/project-users-dialog.component";

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProjectUsersDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    console.log('No data was changed');
    this.dialogRef.close();
  }

  addUsers(users: User[], projectUsers: User[]) {
    // show predefined data
    let userFormControlGroup: FormGroup = this.formBuilder.group({
      'userFormArray': new FormArray([])
    });

    const userFormArray = userFormControlGroup.get('userFormArray') as FormArray;
    users.forEach(user => userFormArray.push(new FormControl(this.isPartOfTheProject(user, projectUsers))));

    const dialogRef = this.dialog.open(ProjectUsersDialogComponent, {
      width: '25%',
      height: '70%',
      data: {
        userFormControlGroup,
        users
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        projectUsers.length = 0;
        let editedProjectUsers = users.filter((user, i) => userFormControlGroup.value.userFormArray[i] === true);
        editedProjectUsers.forEach(user => projectUsers.push(user));
      }
    });
  }

  isPartOfTheProject(user: User, projectUsers: User[]): boolean {
    if (projectUsers !== null) {
      const userIndex = projectUsers.findIndex(projectUser => projectUser.id === user.id);
      return userIndex !== -1;
    }

    return false;
  }
}
