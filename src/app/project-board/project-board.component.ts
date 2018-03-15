import {Component, OnInit} from '@angular/core';
import {ProjectBoardService} from './project-board-service';
import {Project} from '../dto/project';
import {ActivatedRoute} from '@angular/router';
import {Sprint} from '../dto/sprint';
import {User} from '../dto/user';
import {BoardFilterContainer} from './board-filter-container';
import {ProjectDialogComponent} from '../project-dialog/project-dialog.component';
import {MatDialog} from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css']
})
export class ProjectBoardComponent implements OnInit {
  readonly ALL_ID: number = -100;
  readonly ALL_NAME: string = 'ALL';

  allProjects: Project[] = [];
  allUsers: User[] = [];
  currentProject: Project = Project.getBlankProject();
  currentSprint: Sprint = new Sprint(this.ALL_ID, null, null, this.ALL_ID, null);
  currentUser: User = new User(this.ALL_ID, this.ALL_NAME, null);

  constructor(private projectBoardService: ProjectBoardService,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.projectBoardService.changeProjectList.subscribe(projectList => {
      this.allProjects = projectList;
    });

    this.projectBoardService.changeCurrentProject.subscribe(project => {
      this.currentProject = project;
    });
    this.projectBoardService.changeUserList.subscribe(userList => {
      this.allUsers = userList;
    });


    this.currentProject.id = this.route.snapshot.params['id'];

    this.projectBoardService.onGetCurrentProject(this.currentProject.id);

    this.projectBoardService.onGetAllUsers();

    this.projectBoardService.onGetAllProjects('true');
  }

  openEditProjectDialog() {
    let projectNameFormControl = new FormControl(this.currentProject.name);
    let projectDescriptionFormControl = new FormControl(this.currentProject.description);
    let projectUsersFormControl = new FormControl([]);
    const allUsers = this.allUsers;

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
          // this.allUserStories = [];
          this.currentProject.userList = result.projectUsersFormControl.value;
          this.currentProject.name = result.projectNameFormControl.value;
          this.currentProject.description = result.projectDescriptionFormControl.value;

          this.projectBoardService.onUpdateProject(this.currentProject);
        }
      });

  }

  filterItems(item: any, filterContainer: BoardFilterContainer, rowStatus: string): boolean {

    // currentSprint - compare the today date with the sprint start and end date - getCurrentProjectByUserAndSprint
    // currentUser
    // rowStatus

    if (item.status == rowStatus) {
      if (item.user !== null) {
        if (filterContainer.user.id == -1) {
          return true;
        } else if (filterContainer.user.id == item.user.id) { // compare owner
          return true;
        }
      } else {
        if (filterContainer.user.id == -1) {
          return true;
        } else if (filterContainer.user.name == item.owner) { // compare owner
          return true;
        }
      }
    }

    return false;
  }

}
