import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-userstory-sprint-dialog',
  templateUrl: './userstory-sprint-dialog.component.html',
  styleUrls: ['./userstory-sprint-dialog.component.css']
})
export class UserstorySprintDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserstorySprintDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    console.log('No data was changed');
    this.dialogRef.close();
  }
}
