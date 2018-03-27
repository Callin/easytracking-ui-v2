import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BoardItemTypeEnum} from '../project-board/util/board-item-type-enum';
import {UserStoryService} from '../service/user-story-service';
import {TaskService} from '../service/task-service';
import {BugService} from '../service/bug-service';

@Component({
  selector: 'app-board-item-dialog',
  templateUrl: './board-item-dialog.component.html',
  styleUrls: ['./board-item-dialog.component.css']
})
export class BoardItemDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BoardItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userStoryService: UserStoryService,
              private taskService: TaskService,
              private bugService: BugService) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    console.log('No data was changed');
    this.dialogRef.close();
  }

  deleteBoardItem(data: any) {
    if (data.boardItemType === BoardItemTypeEnum.USER_STORY) {
      this.userStoryService.onDeleteUserStory(data.id.value);
    } else if (data.boardItemType === BoardItemTypeEnum.TASK) {
      this.taskService.onDeleteTask(data.id.value, data.userStoryId);
    } else if (data.boardItemType === BoardItemTypeEnum.BUG) {
      this.bugService.onDeleteBug(data.id.value);
    }

    this.dialogRef.close();
  }

}
