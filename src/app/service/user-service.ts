import {EventEmitter, Injectable, Output} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../dto/user';
import {AppConstants} from '../util/app-constants';


@Injectable()
export class UserService {

  allUsers: User[] = [];

  @Output() changeUserList: EventEmitter<User[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  onGetAllUsers() {
    this.getAllUsers()
      .subscribe(response => {
          this.allUsers = response;
          this.changeUserList.emit(this.allUsers);
        }
      );
  }

  getAllUsers() {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get<User[]>(AppConstants.USER_URL + '/all', {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

}
