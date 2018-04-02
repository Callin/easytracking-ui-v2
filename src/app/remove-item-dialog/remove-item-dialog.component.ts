import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-remove-item-dialog',
  templateUrl: './remove-item-dialog.component.html',
  styleUrls: ['./remove-item-dialog.component.css']
})
export class RemoveItemDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    console.log('No data was changed');
    this.dialogRef.close();
  }
}
