import {EventEmitter, Inject, Injectable, Output} from "@angular/core";
import {Router} from "@angular/router";
import {LOCAL_STORAGE_SERVICE, LocalStorageService} from "./local-storage-service";

@Injectable()
export class AuthService {

  @Output() changeIsAuthenticate: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router,
              @Inject(LOCAL_STORAGE_SERVICE) public localStorage: LocalStorageService) {
  }

  signIn(username: string, password: string) {
    if (username === 'dragos' && password === "sapiens") {
      this.changeIsAuthenticate.emit(true);

      this.localStorage.set("userId", 1);
      this.localStorage.set("organizationId", 1);
      this.router.navigate(['']);

    } else if (username === 'bogdan' && password === "sapiens") {
      this.changeIsAuthenticate.emit(true);

      this.localStorage.set("userId", 2);
      this.localStorage.set("organizationId", 1);
      this.router.navigate(['']);
    }
  }

  signOut() {
    this.changeIsAuthenticate.emit(false);
    this.localStorage.remove("userId");
    this.router.navigate(['/signin']);
  }

}
