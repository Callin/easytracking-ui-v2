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

  onCreateUser(user: User) {
    this.createUser(user)
      .subscribe((response) => {
          if (response !== null) {
            this.allUsers.push(response);
            this.changeUserList.emit(this.allUsers);
          }
        },
        (error) => console.log(error)
      );
  }

  createUser(user: User) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<User>(AppConstants.USER_URL, user, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onUpdateUser(user: User) {
    this.updateUser(user)
      .subscribe((response) => {
          if (response != null) {
            console.log('User with id: ' + user.id + ' has been updated ');
          }
        },
        (error) => console.log(error)
      );
  }

  updateUser(user: User) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<User>(AppConstants.USER_URL, user, {headers: header})
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  onDeleteUser(userId: number) {
    this.deleteUser(userId)
      .subscribe((response) => {
          if (response == null) {
            const indexOfUser = this.allUsers.findIndex(user => user.id === userId);
            this.allUsers.splice(indexOfUser, 1);
            this.changeUserList.emit(this.allUsers);
            console.log('User was removed.');
          }
        },
        (error) => console.log(error)
      );
  }

  deleteUser(userId: number) {
    return this.httpClient.delete(AppConstants.USER_URL + '/' + userId)
      .catch((error: Response) => {
        return Observable.throw(error);
      });
  }
}
