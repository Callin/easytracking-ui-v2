import {Component, Inject, OnInit} from '@angular/core';
import {LOCAL_STORAGE_SERVICE, LocalStorageService} from "../service/local-storage-service";
import {isNullOrUndefined} from "util";
import {Router} from '@angular/router';
import {AuthService} from "../service/auth-service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;

  constructor(@Inject(LOCAL_STORAGE_SERVICE) public localStorage: LocalStorageService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {

    this.authService.changeIsAuthenticate.subscribe(isAuth => this.isAuthenticated = isAuth);

    let userId = this.localStorage.get("userId");

    if (isNullOrUndefined(userId)) {
      this.isAuthenticated = false;
      this.router.navigate(['/signin']);
    } else {
      this.isAuthenticated = true;
      console.log("User id is: " + userId);
    }
  }

  signOut() {
    this.authService.signOut();
  }

}
