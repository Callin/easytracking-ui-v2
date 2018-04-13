import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../service/auth-service";

@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})
export class SiginComponent implements OnInit {

  signInFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.signInFormGroup = this.formBuilder.group({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null)
    });
  }

  onSignin() {
    const username = this.signInFormGroup.controls['email'].value;
    const password = this.signInFormGroup.controls['password'].value;

    this.authService.signIn(username, password);
  }

}
