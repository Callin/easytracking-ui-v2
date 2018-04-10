import {Injectable} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../dto/user';
import {AppConstants} from '../util/app-constants';


@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  getAllUsers() {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<User[]>(AppConstants.USER_URL + '/all', {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  createUser(user: User) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<User>(AppConstants.USER_URL, user, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  updateUser(user: User) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<User>(AppConstants.USER_URL, user, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  deleteUser(userId: number) {
    return this.httpClient.delete(AppConstants.USER_URL + '/' + userId)
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
