import {EventEmitter, Inject, Injectable, Output} from "@angular/core";
import {Router} from "@angular/router";
import {LOCAL_STORAGE_SERVICE, LocalStorageService} from "./local-storage-service";

@Injectable()
export class AuthService {

  isAuthenticated: boolean = false;

  @Output() changeIsAuthenticate: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router,
              @Inject(LOCAL_STORAGE_SERVICE) public localStorage: LocalStorageService) {
  }

  signIn(username: string, password: string) {
    if (username === 'dragos') {
      this.isAuthenticated = true;
      this.changeIsAuthenticate.emit(this.isAuthenticated);

      this.localStorage.set("userId", 1);
      this.router.navigate(['']);

    } else if (username === 'bogdan') {
      this.isAuthenticated = true;
      this.changeIsAuthenticate.emit(this.isAuthenticated);

      this.localStorage.set("userId", 2);
      this.router.navigate(['']);
    }
  }

  signOut() {
    this.isAuthenticated = false;
    this.changeIsAuthenticate.emit(this.isAuthenticated);
    this.localStorage.remove("userId");
    this.router.navigate(['/signin']);
  }

}
