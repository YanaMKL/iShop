import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginUser(event){

    let credentials = {
      email:    event.target.querySelector('#email').value,
      password: event.target.querySelector('#password').value
    }

    this.authService.auth(credentials).subscribe( response => {
      if(response.success) {
        
        // Redirect to Shopping Cart
        console.log('User detected ' + response.data.id)
        this.router.navigate(['cart']);
        this.authService.setUser(response.data);

      } else {
        alert('Invalid email or password');
      }
    })
  }

}
