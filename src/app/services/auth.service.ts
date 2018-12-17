import { Injectable } from '@angular/core'
import { DataService } from './data.service'
import { Http } from '@angular/http'
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api = {
    url: 'http://localhost:4000/api/'
  }

  private user: User;

  constructor(private http:Http, private dataService:DataService) {
    
    //  initiate user
    this.user = {}
  }


  getUserDeatils() {
    return this.user;
  }

  auth( credentials ) {

    // post user details for the API
    return this.dataService.auth(credentials);
    // return this.http.post(this.api.url + 'customer/auth', credentials).pipe(
    //   map( res => res.json() )
    // );

  }

  get isLoggedIn() {
    return (this.user.id != undefined);
  }

  setUser( user: User ){
    console.log('setting user ' + user.id);
    this.user = user;
  }
  
}
