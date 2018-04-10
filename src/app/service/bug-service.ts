import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from '../util/app-constants';
import {Bug} from '../dto/bug';


@Injectable()
export class BugService {

  constructor(private httpClient: HttpClient) {
  }

  createBug(bug: Bug) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<Bug>(AppConstants.BUG_URL, bug, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  updateBug(bug: Bug) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Bug>(AppConstants.BUG_URL, bug, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  deleteBug(bugId: number) {
    return this.httpClient.delete(AppConstants.BUG_URL + '/' + bugId)
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
