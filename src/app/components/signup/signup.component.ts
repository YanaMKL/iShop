import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private authServuce: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  signUp(ev) {

    //  Prevent default submit action
    ev.preventDefault();


    //  Validate email address with Regular Expression
    let emailRegex = /^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))$/;

    if(!emailRegex.test(ev.target.email.value)) {
      alert('Please use a valid email address');
      ev.target.email.focus();
      return;
    }

    //  Validate Password length
    if(ev.target.password.value.length < 5) {
      alert('Password must be at least 5 characters');
      ev.target.password.focus();
      return;
    }

    //  Validate Password Match
    if(ev.target.password.value != ev.target.passwordConfirm.value) {
      alert('Password confirm does not match the password you entered');
      ev.target.passwordConfirm.focus();
      return;
    }

    //  Validate full name
    if(!ev.target.name.value.trim().length) {
      alert('Please enter your fullname');
      ev.target.name.focus();
      return;
    }


    //  Register user on the server
    let newCustomer = {
      id: undefined,
      fullname: ev.target.name.value,
      email:    ev.target.email.value,
      password: ev.target.password.value,
      address:   ev.target.address.value,
      city:     ev.target.city.value
    }

    this.dataService.addCustomer(newCustomer).subscribe(response => {
      if(response.success) {

        //  Customer added successfully

        newCustomer.id = response.data.id;      //  get new id

        this.authServuce.setUser(newCustomer);  //  mark as logged in

        this.router.navigate(['cart']);           //  go to cart page


      } else {

        //  Customer email already exists
        alert(response.err);
      }
    })

    return false;

  }

}
