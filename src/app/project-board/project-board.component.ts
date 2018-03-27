import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../service/project-service';
import {Project} from '../dto/project';
import {ActivatedRoute} from '@angular/router';
import {Sprint} from '../dto/sprint';
import {User} from '../dto/user';
import {BoardFilterContainer} from './board-filter-container';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {MatDialog} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../service/user-service';
import {BoardItemDialogComponent} from '../board-item-dialog/board-item-dialog.component';
import {UserStory} from '../dto/user-story';
import {BoardItemStatusEnum} from './util/board-item-status-enum';
import {UserStoryService} from '../service/user-story-service';
import {AppConstants} from '../util/app-constants';
import {Task} from '../dto/task';
import {BoardItemTypeEnum} from './util/board-item-type-enum';
import {Bug} from '../dto/bug';
import {BugService} from '../service/bug-service';
import {TaskService} from '../service/task-service';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css']
})
export class ProjectBoardComponent implements OnInit {
  readonly ALL_ID: number = -100;
  readonly ALL_NAME: string = 'ALL';
  readonly NEW: string = AppConstants.NEW;
  readonly IN_PROGRESS: string = AppConstants.IN_PROGRESS;
  readonly IN_REVIEW: string = AppConstants.IN_REVIEW;
  readonly DONE: string = AppConstants.DONE;
  readonly statusList: string[] = AppConstants.STATUS_LIST;

  filter: BoardFilterContainer = new BoardFilterContainer();

  allProjects: Project[] = [];
  allUsers: User[] = [];
  currentProject: Project = Project.getBlankProject();
  userStories: UserStory[] = [];
  currentSprint: Sprint = new Sprint(this.ALL_ID, null, null, this.ALL_ID, null);
  currentUser: User = new User(this.ALL_ID, this.ALL_NAME, null);

  constructor(private projectService: ProjectService,
              private userService: UserService,
              private userStoryService: UserStoryService,
              private taskService: TaskService,
              private bugService: BugService,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.projectService.changeProjectList.subscribe(projectList => {
      this.allProjects = projectList;
    });

    this.projectService.changeCurrentProject.subscribe(project => {
      this.currentProject = project;
    });
    this.userService.changeUserList.subscribe(userList => {
      this.allUsers = userList;
    });
    this.userStoryService.changeUserStoryList.subscribe(userStories => {
      this.userStories = userStories;
    });


    this.currentProject.id = this.route.snapshot.params['id'];

    this.projectService.onGetCurrentProject(this.currentProject.id);

    this.userService.onGetAllUsers();

    this.projectService.onGetAllProjects('true');

    this.userStoryService.onGetUserStories(this.currentProject.id);
  }

  openEditProjectDialog() {
    let projectNameFormControl = new FormControl(this.currentProject.title);
    let projectDescriptionFormControl = new FormControl(this.currentProject.description);
    let projectUsersFormControl = new FormControl([]);
    const allUsers = this.allUsers;
    console.log('this all users size: ' + this.allUsers.length);
    console.log('all users size: ' + allUsers.length);

    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      height: '40%',
      minHeight: 350, // assumes px
      data: {
        projectNameFormControl,
        projectDescriptionFormControl,
        projectUsersFormControl,
        allUsers
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          this.currentProject.userList = result.projectUsersFormControl.value;
          this.currentProject.title = result.projectNameFormControl.value;
          this.currentProject.description = result.projectDescriptionFormControl.value;

          this.projectService.onUpdateProject(this.currentProject);
        }
      });

  }

  filterItems(item: any, filterContainer: BoardFilterContainer, rowStatus: string): boolean {

    // currentSprint - compare the today date with the sprint start and end date - getCurrentProjectByUserAndSprint
    // currentUser
    // rowStatus
    if (item.status.toUpperCase() === rowStatus.toUpperCase()) {
      return true
    }

    return false;
  }

  openNewUserStoryDialog() {
    let userStory: UserStory = UserStory.getBlankUserStory();

    let name = new FormControl(userStory.name);
    let description = new FormControl(userStory.description);
    let status = new FormControl(BoardItemStatusEnum.NEW);
    let priority = new FormControl(2);
    let estimation = new FormControl(2);
    let user = new FormControl(userStory.user);

    const allUsers = this.allUsers;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = true;
    const boardItemType = BoardItemTypeEnum.USER_STORY;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      width: '60%',
      height: '50%',
      minHeight: 400, // assumes px
      data: {
        name, description, status, priority, estimation, user,
        allUsers,
        statusList,
        isNew,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          let userStory: UserStory = UserStory.getBlankUserStory();
          userStory.name = result.name.value;
          userStory.description = result.description.value;
          userStory.status = result.status.value;

          userStory.priority = result.priority.value;
          userStory.estimation = result.estimation.value;

          let user: User = User.getBlankUser();
          user.id = result.user.value.id;
          userStory.user = user;

          let project: Project = Project.getBlankProject();
          project.id = this.currentProject.id;

          userStory.project = project;

          console.log('On create user story: ');
          this.userStoryService.onCreateUserStory(userStory);
        }
      });

  }

  openExistingUserStoryDialog(userStory: UserStory) {

    let id = new FormControl(userStory.id);
    let name = new FormControl(userStory.name);
    let description = new FormControl(userStory.description);
    let status = new FormControl(userStory.status);
    let priority = new FormControl(userStory.priority);
    let estimation = new FormControl(userStory.estimation);
    let user = new FormControl(userStory.user);

    const allUsers = this.allUsers;
    const statusList: string[] = this.statusList;
    const isNew = false;
    const boardItemType = BoardItemTypeEnum.USER_STORY;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      width: '60%',
      height: '50%',
      minHeight: 400, // assumes px
      data: {
        id, name, description, status, priority, estimation, user,
        allUsers,
        statusList,
        isNew,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          userStory.id = result.id.value;
          userStory.name = result.name.value;
          userStory.description = result.description.value;
          userStory.status = result.status.value;
          userStory.priority = result.priority.value;
          userStory.estimation = result.estimation.value;

          let user: User = User.getBlankUser();
          user.id = result.user.value.id;
          user.name = result.user.value.name;
          userStory.user = user;

          this.userStoryService.onUpdateUserStory(userStory);
        }
      });
  }

  openNewTaskDialog(userStory: UserStory) {
    let task: Task = Task.getBlankTask();

    let name = new FormControl(task.name);
    let description = new FormControl(task.description);
    let status = new FormControl(task.status);
    let priority = new FormControl(task.priority);
    let estimation = new FormControl(task.estimation);
    let user = new FormControl(task.user);

    const allUsers = this.allUsers;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = true;
    const boardItemType = BoardItemTypeEnum.TASK;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      width: '60%',
      height: '50%',
      minHeight: 400, // assumes px
      data: {
        name, description, status, priority, estimation, user,
        allUsers,
        statusList,
        isNew,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          // this.allUserStories = [];
          // name, description, status, priority, estimation, user,

          let taskToSave: Task = Task.getBlankTask();
          taskToSave.name = result.name.value;
          taskToSave.description = result.description.value;
          taskToSave.status = result.status.value;
          taskToSave.priority = result.priority.value;
          taskToSave.estimation = result.estimation.value;

          let user: User = User.getBlankUser();
          user.id = result.user.value.id;
          taskToSave.user = user;

          let parentUserStory: UserStory = UserStory.getBlankUserStory();
          parentUserStory.id = userStory.id;

          taskToSave.userStory = parentUserStory;

          this.taskService.onCreateTask(taskToSave, userStory);
        }
      });
  }

  openExistingTaskDialog(userStory: UserStory, task: Task) {

    let id = new FormControl(task.id);console.log("Id: " + id.value);
    let name = new FormControl(task.name);
    let description = new FormControl(task.description);
    let status = new FormControl(task.status);
    let priority = new FormControl(task.priority);
    let estimation = new FormControl(task.estimation);
    let user = new FormControl(task.user);

    const userStoryId = userStory.id;

    const allUsers = this.allUsers;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = false;
    const boardItemType = BoardItemTypeEnum.TASK;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      width: '60%',
      height: '50%',
      minHeight: 400, // assumes px
      data: {
        id, name, description, status, priority, estimation, user,
        allUsers,
        statusList,
        isNew,
        userStoryId,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          task.id = result.id.value;
          task.name = result.name.value;
          task.description = result.description.value;
          task.status = result.status.value;
          task.priority = result.priority.value;
          task.estimation = result.estimation.value;

          let user: User = User.getBlankUser();
          user.id = result.user.value.id;
          user.name = result.user.value.name;
          task.user = user;

          let parentUserStory: UserStory = UserStory.getBlankUserStory();
          parentUserStory.id = userStory.id;
          task.userStory = parentUserStory;

          this.taskService.onUpdateTask(task);
        }
      });
  }

  openNewBugDialog(userStory: UserStory) {
    let bug: Bug = Bug.getBlankBug();

    let name = new FormControl(bug.name);
    let description = new FormControl(bug.description);
    let status = new FormControl(bug.status);
    let priority = new FormControl(bug.priority);
    let estimation = new FormControl(bug.estimation);
    let user = new FormControl(bug.user);

    const allUsers = this.allUsers;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = true;
    const boardItemType = BoardItemTypeEnum.BUG;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      width: '60%',
      height: '50%',
      minHeight: 400, // assumes px
      data: {
        name, description, status, priority, estimation, user,
        allUsers,
        statusList,
        isNew,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          let bugToSave: Bug = Bug.getBlankBug();
          bugToSave.name = result.name.value;
          bugToSave.description = result.description.value;
          bugToSave.status = result.status.value;
          bugToSave.priority = result.priority.value;
          bugToSave.estimation = result.estimation.value;

          let user: User = User.getBlankUser();
          user.id = result.user.value.id;
          user.name = result.user.value.name;
          bugToSave.user = user;

          bugToSave.userStory = userStory;

          console.log("On create user story: ");
          this.bugService.onCreateBug(bugToSave, userStory);
        }
      });

  }

  openExistingBugDialog(bug: Bug, userStory: UserStory) {
    let id = new FormControl(bug.id);
    let name = new FormControl(bug.name);
    let description = new FormControl(bug.description);
    let status = new FormControl(bug.status);
    let priority = new FormControl(bug.priority);
    let estimation = new FormControl(bug.estimation);
    let user = new FormControl(bug.user);

    const userStoryId = userStory.id;

    const allUsers = this.allUsers;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = false;
    const boardItemType = BoardItemTypeEnum.BUG;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      width: '60%',
      height: '50%',
      minHeight: 400, // assumes px
      data: {
        id, name, description, status, priority, estimation, user,
        allUsers,
        statusList,
        isNew,
        userStoryId,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          bug.name = result.name.value;
          bug.description = result.description.value;
          bug.status = result.status.value;
          bug.priority = result.priority.value;
          bug.estimation = result.estimation.value;

          bug.user.id = result.user.value.id;
          bug.user.name = result.user.value.name;

          bug.userStory = userStory;

          this.bugService.updateBug(bug);
        }
      });

  }

  onUserStoryStatusChange(userStory: UserStory) {
    this.userStoryService.onUpdateUserStory(userStory);
  }

  onTaskStatusChange(item: Task) {
    this.taskService.onUpdateTask(item);
  }

  onBugStatusChange(item: Bug) {
    this.bugService.onUpdateBug(item);
  }

}
