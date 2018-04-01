import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from "../util/app-constants";
import {Organization} from "../dto/organization";


@Injectable()
export class OrganizationService {

  organizationList: Organization[];
  currentOrganization: Organization;

  @Output() changeOrganizationList: EventEmitter<Organization[]> = new EventEmitter();
  @Output() changeCurrentOrganization: EventEmitter<Organization> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  onGetOrganization(organizationId: number) {
    this.getOrganization(organizationId)
      .subscribe(response => {
          this.currentOrganization = response;
          this.changeCurrentOrganization.emit(this.currentOrganization);
        },
        (error) => console.log(error)
      );
  }

  getOrganization(organizationId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Organization>(AppConstants.ORGANIZATION_URL + '/organizationid/' + organizationId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onGetAllOrganizations() {
    this.getAllOrganizations()
      .subscribe(
        (organizations) => {
          this.organizationList = organizations;
          this.changeOrganizationList.emit(this.organizationList);
        },
        (error) => console.log(error)
      );
  }

  getAllOrganizations() {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Organization[]>(AppConstants.ORGANIZATION_URL + '/all', {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onCreateOrganization(organization: Organization) {
    this.createOrganization(organization)
      .subscribe((response) => {
          if (response !== null) {
            this.organizationList.push(response);
            this.changeOrganizationList.emit(this.organizationList);
          }
        },
        (error) => console.log(error)
      );
  }

  createOrganization(organization: Organization) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Organization>(AppConstants.ORGANIZATION_URL, organization, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onUpdateOrganization(organization: Organization) {
    this.updateOrganization(organization)
      .subscribe((response) => {
          if (response != null) {
            console.log('Organization with id: ' + organization.id + ' has been updated ');
          }
        },
        (error) => console.log(error)
      );
  }

  updateOrganization(organization: Organization) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Organization>(AppConstants.ORGANIZATION_URL, organization, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onDeleteOrganization(organizationId: number) {
    this.deleteOrganization(organizationId)
      .subscribe((response) => {
          if (response == null) {
            console.log('Organization was removed.');
            // const indexOfUserStory = this.userStories.findIndex(story => story.id === userStoryId);
            // this.userStories.splice(indexOfUserStory, 1);
            // this.changeUserStoryList.emit(this.userStories);
          }
        },
        (error) => console.log(error)
      );
  }

  deleteOrganization(organizationId: number) {
    return this.httpClient.delete(AppConstants.ORGANIZATION_URL + '/' + organizationId)
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
