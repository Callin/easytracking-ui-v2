import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from "../util/app-constants";
import {Organization} from "../dto/organization";


@Injectable()
export class OrganizationService {

  constructor(private httpClient: HttpClient) {
  }

  getOrganization(organizationId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Organization>(AppConstants.ORGANIZATION_URL + "/" + organizationId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getAllOrganizations() {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Organization[]>(AppConstants.ORGANIZATION_URL + '/all', {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getAllOrganizationsByUserId(userId: number) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<Organization[]>(AppConstants.ORGANIZATION_URL + "/user/" + userId, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  createOrganization(organization: Organization) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Organization>(AppConstants.ORGANIZATION_URL, organization, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  updateOrganization(organization: Organization) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Organization>(AppConstants.ORGANIZATION_URL, organization, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  deleteOrganization(organizationId: number) {
    return this.httpClient.delete(AppConstants.ORGANIZATION_URL + '/' + organizationId)
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
