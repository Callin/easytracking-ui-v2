import {Component, Inject, OnInit} from '@angular/core';
import {RemoveItemDialogComponent} from "../remove-item-dialog/remove-item-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-project-users-dialog',
  templateUrl: './project-users-dialog.component.html',
  styleUrls: ['./project-users-dialog.component.css']
})
export class ProjectUsersDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    console.log('No data was changed');
    this.dialogRef.close();
  }
}
