import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})
export class SiginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSignin(form: NgForm) {
// call the server
    const email = form.value.email;
    const password = form.value.password;


    console.log('Credentials= email: ' + email + ' password: ' + password);
  }

}
