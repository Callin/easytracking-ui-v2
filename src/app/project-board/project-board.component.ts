import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../service/project-service';
import {Project} from '../dto/project';
import {ActivatedRoute} from '@angular/router';
import {Sprint} from '../dto/sprint';
import {User} from '../dto/user';
import {BoardFilterContainer} from './board-filter-container';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
              private formBuilder: FormBuilder,
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
    let projectForm: FormGroup = this.formBuilder.group({
      'title': new FormControl(this.currentProject.title, Validators.required),
      'description': new FormControl(this.currentProject.description),
      // 'users': this.formBuilder.array([new FormControl(this.currentProject.userList)])
      'users': new FormControl(this.currentProject.userList)
    });

    const allTheUsers = this.allUsers;
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      height: '40%',
      minHeight: 350, // assumes px
      data: {
        projectForm,
        allTheUsers
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          this.currentProject.title = result.projectForm.controls['title'].value;
          this.currentProject.description = result.projectForm.controls['description'].value;
          this.currentProject.userList = result.projectForm.controls['users'].value;
          // this.currentProject.userList = (<FormArray>result.projectForm.get('users')).value;

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
    let boardItemForm: FormGroup = this.formBuilder.group({
      'id': new FormControl(null),
      'name': new FormControl("", Validators.required),
      'description': new FormControl(""),
      'status': new FormControl(BoardItemStatusEnum.NEW),
      'priority': new FormControl(2),
      'estimation': new FormControl(2),
      'user': new FormControl(null, Validators.required)
    });

    const allUsers = this.currentProject.userList;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = true;
    const boardItemType = BoardItemTypeEnum.USER_STORY;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        boardItemForm,
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
          userStory.name = result.boardItemForm.controls['name'].value;
          userStory.description = result.boardItemForm.controls['description'].value;
          userStory.status = result.boardItemForm.controls['status'].value;
          userStory.priority = result.boardItemForm.controls['priority'].value;
          userStory.estimation = result.boardItemForm.controls['estimation'].value;

          userStory.user = result.boardItemForm.controls['user'].value;

          userStory.project = this.currentProject;

          console.log('On create user story: ');
          this.userStoryService.onCreateUserStory(userStory);
        }
      });

  }

  openExistingUserStoryDialog(userStory: UserStory) {

    let boardItemForm: FormGroup = this.formBuilder.group({
      'id': new FormControl(userStory.id),
      'name': new FormControl(userStory.name, Validators.required),
      'description': new FormControl(userStory.description),
      'status': new FormControl(userStory.status),
      'priority': new FormControl(userStory.priority),
      'estimation': new FormControl(userStory.estimation),
      'user': new FormControl(userStory.user)
    });

    const allUsers = this.currentProject.userList;
    const statusList: string[] = this.statusList;
    const isNew = false;
    const boardItemType = BoardItemTypeEnum.USER_STORY;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        boardItemForm,
        allUsers,
        statusList,
        isNew,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          userStory.id = result.boardItemForm.controls['id'].value;
          userStory.name = result.boardItemForm.controls['name'].value;
          userStory.description = result.boardItemForm.controls['description'].value;
          userStory.status = result.boardItemForm.controls['status'].value;
          userStory.priority = result.boardItemForm.controls['priority'].value;
          userStory.estimation = result.boardItemForm.controls['estimation'].value;

          userStory.user = result.boardItemForm.controls['user'].value;

          this.userStoryService.onUpdateUserStory(userStory);
        }
      });
  }

  openNewTaskDialog(userStory: UserStory) {
    let boardItemForm: FormGroup = this.formBuilder.group({
      'id': new FormControl(null),
      'name': new FormControl("", Validators.required),
      'description': new FormControl(""),
      'status': new FormControl(BoardItemStatusEnum.NEW),
      'priority': new FormControl(2),
      'estimation': new FormControl(2),
      'user': new FormControl(null, Validators.required)
    });

    const allUsers = this.currentProject.userList;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = true;
    const boardItemType = BoardItemTypeEnum.TASK;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        boardItemForm,
        allUsers,
        statusList,
        isNew,
        boardItemType
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          let taskToSave: Task = Task.getBlankTask();
          taskToSave.name = result.boardItemForm.controls['name'].value;
          taskToSave.description = result.boardItemForm.controls['description'].value;
          taskToSave.status = result.boardItemForm.controls['status'].value;
          taskToSave.priority = result.boardItemForm.controls['priority'].value;
          taskToSave.estimation = result.boardItemForm.controls['estimation'].value;

          taskToSave.user = result.boardItemForm.controls['user'].value;

          taskToSave.userStory = userStory;

          this.taskService.onCreateTask(taskToSave, userStory);
        }
      });
  }

  openExistingTaskDialog(userStory: UserStory, task: Task) {

    let boardItemForm: FormGroup = this.formBuilder.group({
      'id': new FormControl(task.id),
      'name': new FormControl(task.name, Validators.required),
      'description': new FormControl(task.description),
      'status': new FormControl(task.status),
      'priority': new FormControl(task.priority),
      'estimation': new FormControl(task.estimation),
      'user': new FormControl(task.user)
    });

    const userStoryId = userStory.id;

    const allUsers = this.currentProject.userList;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = false;
    const boardItemType = BoardItemTypeEnum.TASK;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        boardItemForm,
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
          task.id = result.boardItemForm.controls['id'].value;
          task.name = result.boardItemForm.controls['name'].value;
          task.description = result.boardItemForm.controls['description'].value;
          task.status = result.boardItemForm.controls['status'].value;
          task.priority = result.boardItemForm.controls['priority'].value;
          task.estimation = result.boardItemForm.controls['estimation'].value;

          task.user = result.boardItemForm.controls['user'].value;

          let parentUserStory: UserStory = UserStory.getBlankUserStory();
          parentUserStory.id = userStory.id;
          task.userStory = parentUserStory;

          this.taskService.onUpdateTask(task);
        }
      });
  }

  openNewBugDialog(userStory: UserStory) {
    let boardItemForm: FormGroup = this.formBuilder.group({
      'id': new FormControl(null),
      'name': new FormControl("", Validators.required),
      'description': new FormControl(""),
      'status': new FormControl(BoardItemStatusEnum.NEW),
      'priority': new FormControl(2),
      'estimation': new FormControl(2),
      'user': new FormControl(null, Validators.required)
    });

    const allUsers = this.currentProject.userList;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = true;
    const boardItemType = BoardItemTypeEnum.BUG;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        boardItemForm,
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
          bugToSave.name = result.boardItemForm.controls['name'].value;
          bugToSave.description = result.boardItemForm.controls['description'].value;
          bugToSave.status = result.boardItemForm.controls['status'].value;
          bugToSave.priority = result.boardItemForm.controls['priority'].value;
          bugToSave.estimation = result.boardItemForm.controls['estimation'].value;

          bugToSave.user = result.boardItemForm.controls['user'].value;

          bugToSave.userStory = userStory;

          this.bugService.onCreateBug(bugToSave, userStory);
        }
      });

  }

  openExistingBugDialog(bug: Bug, userStory: UserStory) {
    let boardItemForm: FormGroup = this.formBuilder.group({
      'id': new FormControl(bug.id),
      'name': new FormControl(bug.name, Validators.required),
      'description': new FormControl(bug.description),
      'status': new FormControl(bug.status),
      'priority': new FormControl(bug.priority),
      'estimation': new FormControl(bug.estimation),
      'user': new FormControl(bug.user)
    });

    const userStoryId = userStory.id;

    const allUsers = this.currentProject.userList;
    const statusList: string[] = [BoardItemStatusEnum.NEW, BoardItemStatusEnum.IN_PROGRSESS,
      BoardItemStatusEnum.IN_REVIEW, BoardItemStatusEnum.DONE];
    const isNew = false;
    const boardItemType = BoardItemTypeEnum.BUG;

    const dialogRef = this.dialog.open(BoardItemDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        boardItemForm,
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
          bug.id = result.boardItemForm.controls['id'].value;
          bug.name = result.boardItemForm.controls['name'].value;
          bug.description = result.boardItemForm.controls['description'].value;
          bug.status = result.boardItemForm.controls['status'].value;
          bug.priority = result.boardItemForm.controls['priority'].value;
          bug.estimation = result.boardItemForm.controls['estimation'].value;

          bug.user = result.boardItemForm.controls['user'].value;

          let parentUserStory: UserStory = UserStory.getBlankUserStory();
          parentUserStory.id = userStory.id;
          bug.userStory = parentUserStory;

          this.bugService.onUpdateBug(bug);
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

  onProjectChange(project: Project) {
    this.userStoryService.onGetUserStories(project.id);
    this.currentProject = project;
  }

  getUserName(user: User): string {
    return (user === null || user === undefined) ? "none" : user.name;
  }
}
