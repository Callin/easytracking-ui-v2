import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {OrganizationService} from "../service/organization-service";
import {FormBuilder} from "@angular/forms";
import {Organization} from "../dto/organization";

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

    this.organizationService.getAllOrganizations().subscribe(
      (organizations) => this.organizationList = organizations,
      (error) => console.log(error));
  }

  openNewOrganizationDialog() {

  }

  openEditOrganizationUsersDialog(organization: Organization) {

  }

  openEditOrganizationDialog(organization) {

  }

  openRemoveOrganizationDialog(organizationId: number, organizationName: string, removeType: string) {

  }

}
