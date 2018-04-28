import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-sprint-dialog',
  templateUrl: './sprint-dialog.component.html',
  styleUrls: ['./sprint-dialog.component.css']
})
export class SprintDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SprintDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  onNoClick(): void {
    console.log('No data was changed');
    this.dialogRef.close();
  }

}
