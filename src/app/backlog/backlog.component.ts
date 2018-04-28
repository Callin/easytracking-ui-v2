import {Component, OnInit} from '@angular/core';
import {UserStoryService} from "../service/user-story-service";
import {ActivatedRoute} from "@angular/router";
import {UserStory} from "../dto/user-story";
import {Sprint} from "../dto/sprint";
import {isNullOrUndefined} from "util";
import {SprintService} from "../service/sprint-service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {SprintDialogComponent} from "../sprint-dialog/sprint-dialog.component";
import {MatDialog} from "@angular/material";
import {Project} from "../dto/project";
import {ToastrService} from "ngx-toastr";
import {RemoveItemDialogComponent} from "../remove-item-dialog/remove-item-dialog.component";
import {UserstorySprintDialogComponent} from "../userstory-sprint-dialog/userstory-sprint-dialog.component";

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

  userStories: UserStory[] = [];

  sprints: Sprint[] = [];

  MAGIC_ID: number = -100;

  constructor(private route: ActivatedRoute,
              private userStoryService: UserStoryService,
              private sprintService: SprintService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // load the stories for project with ID
    // load

    this.userStoryService.getUserStories(this.route.snapshot.params['id'])
      .subscribe(response => {
        this.userStories = response
      });

    this.sprintService.getSprintsByProjectId(this.route.snapshot.params['id'])
      .subscribe(response => {
        this.sprints = response;
        this.sprints.push(this.addBacklogToSprintList());
      });
  }

  openNewSprintDialog() {
    // show predefined data
    let sprintFormControlGroup: FormGroup = this.formBuilder.group({
      'sprintNumber': new FormControl(""),
      'startDate': new FormControl(""),
      'endDate': new FormControl(""),
    });

    const dialogRef = this.dialog.open(SprintDialogComponent, {
      width: '35%',
      height: '16%',
      minWidth: 670,
      minHeight: 150,
      data: {
        sprintFormControlGroup,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        let sprint: Sprint = Sprint.getBlankSprint();
        sprint.sprintNumber = result.sprintFormControlGroup.controls['sprintNumber'].value;
        sprint.startDate = result.sprintFormControlGroup.controls['startDate'].value;
        sprint.endDate = result.sprintFormControlGroup.controls['endDate'].value;

        let project: Project = Project.getBlankProject();
        project.id = this.route.snapshot.params['id'];

        sprint.project = project;

        this.sprintService.createSprint(sprint).subscribe(
          (response) => {
            this.sprints.push(response);
            this.toastr.success("Sprint " + sprint.sprintNumber + ' was created', 'Sprint add')
          },
          (error) => {
            this.toastr.error("Sprint " + sprint.sprintNumber + ' was not created', 'Sprint creation failed');
            console.log(error);
          });
      }
    });
  }

  openRemoveItemDialog(sprint: Sprint) {
    // show predefined data

    const name = 'Sprint ' + sprint.sprintNumber;
    const type = 'sprint';

    const dialogRef = this.dialog.open(RemoveItemDialogComponent, {
      width: '30%',
      height: '20%',
      minHeight: 170, // assumes px
      data: {
        name,
        type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed');
        if (result != null) {
          this.sprintService.delete(sprint.id).subscribe(
            (response) => {
              if (response == null) {
                const indexOfSprint = this.sprints.findIndex(item => item.id === sprint.id);
                this.sprints.splice(indexOfSprint, 1);
                this.toastr.success("Sprint " + sprint.sprintNumber + ' was removed', 'Sprint removed');
              }
            },
            (error) => {
              this.toastr.error("Sprint " + sprint.sprintNumber + ' was not removed', 'Sprint removal failed');
              console.log(error);
            });
        }
      }
    );
  }

  openEditSprintDialog(userStory: UserStory) {
    // show predefined data
    let sprintFormControlGroup: FormGroup = this.formBuilder.group({
      'sprintFormControl': new FormControl()
    });

    let sprintList = this.sprints;

    const dialogRef = this.dialog.open(UserstorySprintDialogComponent, {
      width: '25%',
      height: '70%',
      data: {
        sprintFormControlGroup,
        sprintList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      if (result != null) {
        let sprintId = result.sprintFormControlGroup.controls['sprintFormControl'].value;
        if (sprintId === this.MAGIC_ID) {
          userStory.sprint = null;
        } else {
          userStory.sprint = this.sprints.find(item => item.id === sprintId);
        }

        this.userStoryService.updateUserStory(userStory).subscribe(
          (response) => this.toastr.success('User story with id: ' + userStory.id + ' has been updated ', 'User story updated'),
          (error) => {
            this.toastr.error('User story with id: ' + userStory.id + ' has not been updated', 'User story update failed');
            console.log(error);
          });
      }
    });
  }

  addBacklogToSprintList(): Sprint {
    let sprint = Sprint.getBlankSprint();
    sprint.id = this.MAGIC_ID;
    sprint.sprintNumber = this.MAGIC_ID;

    return sprint;
  }

  getSprints(): Sprint[] {
    return this.sprints.filter(item => item.id !== this.MAGIC_ID);
  }

  getSprintNumber(sprint: Sprint): String {
    return isNullOrUndefined(sprint) ? "none" : "Sprint " + sprint.sprintNumber.toLocaleString();
  }

  getUserStoriesWithoutSprint(): UserStory[] {
    return this.userStories.filter(userStory => isNullOrUndefined(userStory.sprint));
  }

  getUserStoriesBySprint(sprint): UserStory[] {
    return this.userStories.filter(userStory =>
      isNullOrUndefined(userStory.sprint) ? false : userStory.sprint.id === sprint.id);
  }

  getProjectTitle(): String {

    if (this.userStories.length > 0 &&
      !isNullOrUndefined(this.userStories[0].project) &&
      !isNullOrUndefined(this.userStories[0].project.title)) {

      return this.userStories[0].project.title;
    }

    return "none";
  }
}
