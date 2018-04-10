import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BoardItemTypeEnum} from '../project-board/util/board-item-type-enum';
import {UserStoryService} from '../service/user-story-service';
import {TaskService} from '../service/task-service';
import {BugService} from '../service/bug-service';
import {UserStory} from "../dto/user-story";

@Component({
  selector: 'app-board-item-dialog',
  templateUrl: './board-item-dialog.component.html',
  styleUrls: ['./board-item-dialog.component.css']
})
export class BoardItemDialogComponent implements OnInit {

  userStories: UserStory[] = [];

  @Output() changeUserStoryList: EventEmitter<UserStory[]> = new EventEmitter();

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
      let userStoryId: number = data.boardItemForm.controls['id'].value;
      this.userStoryService.deleteUserStory(userStoryId)
        .subscribe((response) => {
            if (response == null) {
              console.log('User story was removed.');
              const indexOfUserStory = this.userStories.findIndex(story => story.id === userStoryId);
              this.userStories.splice(indexOfUserStory, 1);
              this.changeUserStoryList.emit(this.userStories);
            }
          },
          (error) => console.log(error)
        );
    } else if (data.boardItemType === BoardItemTypeEnum.TASK) {
      let taskId: number = data.boardItemForm.controls['id'].value;
      let userStoryId: number = data.userStoryId;

      this.taskService.deleteTask(taskId)
        .subscribe((response) => {
            if (response == null) {
              console.log('Task was removed.');
              let taskList = this.userStories.find(userStory => userStory.id === userStoryId).tasks;
              const indexOfTask = taskList.findIndex(task => task.id === taskId);
              taskList.splice(indexOfTask, 1);
              this.changeUserStoryList.emit(this.userStories);
            }
          },
          (error) => console.log(error)
        );

    } else if (data.boardItemType === BoardItemTypeEnum.BUG) {

      let bugId: number = data.boardItemForm.controls['id'].value;
      let userStoryId: number = data.userStoryId;

      this.bugService.deleteBug(bugId,)
        .subscribe((response) => {
            if (response == null) {
              console.log('Bug was removed.');
              const bugList = this.userStories.find(userStory => userStory.id === userStoryId).bugs;
              const indexOfBug = bugList.findIndex(bug => bug.id === bugId);
              bugList.splice(indexOfBug, 1);
              this.changeUserStoryList.emit(this.userStories);
            }
          },
          (error) => console.log(error));
    }

    this.dialogRef.close();
  }

}
