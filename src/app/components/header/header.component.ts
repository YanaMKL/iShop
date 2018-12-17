import { Component, OnInit } from '@angular/core';
import '../../interfaces/interfaces';

import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user:User;
  categories: Category[];

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {
  
      //  Get categories for the dropdown list
      dataService.getCategories().subscribe( response => {

        console.log( response );

        if(response.success)
          this.categories = response.data;
      })
  }

  ngOnInit() {
    
  }

  get loggedIn() {

    this.user = this.authService.getUserDeatils();
    return this.authService.isLoggedIn;
  }

}
