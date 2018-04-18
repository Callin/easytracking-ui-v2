import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {OrganizationService} from "../service/organization-service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Organization} from "../dto/organization";
import {OrganizationDialogComponent} from "../organization-dialog/organization-dialog.component";
import {User} from "../dto/user";

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.css']
})
export class AdminBoardComponent implements OnInit {
  organizationList: Organization[] = [];

  REMOVE_ORGANIZATION: string = "organization";

  constructor(public dialog: MatDialog,
              private organizationService: OrganizationService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.organizationService.getAllOrganizations('true').subscribe(
      (organizations) => this.organizationList = organizations,
      (error) => console.log(error));
  }

  openNewOrganizationDialog() {
    let organizationFormGroup: FormGroup = this.formBuilder.group({
      'id': new FormControl(null),
      'name': new FormControl("", Validators.required),
      'user': new FormControl(null, Validators.required)
    });

    let adminList: User[] = [];

    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        organizationFormGroup,
        adminList
      }
    });


    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          let organization: Organization = Organization.getBlankOrganization();
          organization.name = result.organizationFormGroup.controls['name'].value;
          // organization.userList = result.adminList;

          this.organizationService.createOrganization(organization).subscribe(
            (response) => this.organizationList.push(response),
            (error) => console.log(error)
          );
        }
      });

  }

  openEditOrganizationDialog(organization: Organization) {

    let organizationFormGroup: FormGroup = this.formBuilder.group({
      'id': new FormControl(organization.id),
      'name': new FormControl(organization.name, Validators.required),
      'user': new FormControl(null, Validators.required)
    });

    let adminList: User[] = [];

    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      minWidth: '60%',
      minHeight: '50%',
      data: {
        organizationFormGroup,
        adminList,
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result != null) {
          organization.id = result.organizationFormGroup.controls['id'].value;
          organization.name = result.organizationFormGroup.controls['name'].value;

          organization.userList = result.organizationFormGroup.controls['user'].value;

          this.organizationService.updateOrganization(organization).subscribe(
            (response) => console.log("Organization was updated. Id " + organization.id),
            (error) => console.log(error));
        }
      });
  }

  openRemoveOrganizationDialog(organizationId: number, organizationName: string, removeType: string) {

  }

  openEditOrganizationUsersDialog(organization: Organization) {

  }
}
