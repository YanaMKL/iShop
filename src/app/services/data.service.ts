import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  api = {
    url: 'http://localhost:4000/api/'
  }


  constructor(public http:Http) {
    console.log('Data Service Connected');
  }

  getCategories() {
    return this.http.get(this.api.url + 'getCategories').pipe(
      map( res => res.json() )
    );
  }

  getProducts() {
    return this.http.get(this.api.url + 'getProducts').pipe(
      map( res => res.json() )
    );
  }

  getProductById(id) {
    console.log('%c Getting product by id from API...','color: orange');
    return this.http.get(this.api.url + 'getProduct/' + id).pipe(
      map( res => res.json() )
    );
  }

  getProductsByKeyword(keyword) {
    console.log('%c Getting product by keyword from API...','color: orange');
    return this.http.get(this.api.url + 'getProducts/' + keyword).pipe(
      map( res => res.json() )
    );
  }


  getProductsByCategory(categoryid) {
    console.log('%c Getting product by id from API...','color: orange');
    return this.http.get(this.api.url + 'getProductsByCategory/' + categoryid).pipe(
      map( res => res.json() )
    );
  }

  //  --- Category EndPoints ------------------------------------------------- /
  
  addCategory(category:Category){
    console.log('%c Adding new category through API...','color: orange');
    return this.http.post(this.api.url + 'addCategory/',category).pipe(
      map( res => res.json() )
    );
  }

  getCategory(id:number){
    console.log('%c Getting new category through API...','color: orange');
    return this.http.get(this.api.url + 'getCategory/' + id).pipe(
      map( res => res.json() )
    );
  }

  updateCategory(category:Category){
    console.log('%c Updating category through API...','color: orange');
    return this.http.post(this.api.url + 'updateCategory/', category).pipe(
      map( res => res.json() )
    );
  }


  //  --- Cart EndPoints ------------------------------------------------------- /
  createCart(cart){
    return this.http.post(this.api.url + 'cart/create/', cart).pipe(
      map( res => res.json() )
    )
  }

  getCart(cartId: number) {
    return this.http.get(this.api.url + 'cart/getCart/' + cartId).pipe(
      map( res => res.json() )
    )
  }

  getOpenCart(userId: number) {
    
    console.log('Checking if there is any open cart for user ' + userId);

    let data = {
      userId: userId
    }
    return this.http.post(this.api.url + 'user/getLastOpenCart/', data).pipe(
      map( res => res.json() )
    )  
  }

  upsertProduct(cartItem) {
    return this.http.post(this.api.url + 'cart/upsertProduct/', cartItem).pipe(
      map( res => res.json() )
    )
  }

  removeProduct(cartObj) {
    return this.http.post(this.api.url + 'cart/removeProduct/', cartObj).pipe(
      map( res => res.json() )
    )
  }

  //  --- Auth ----------------- /
  auth(credentials){
    return this.http.post(this.api.url + 'customer/auth', credentials).pipe(
      map( res => res.json() )
    );
  }

  addCustomer(customer) {
    return this.http.post(this.api.url + 'addCustomer', customer).pipe(
      map( res => res.json() )
    );  
  }


  //  --- Orders --------------- /
  createOrder(order) {
    return this.http.post(this.api.url + 'order/create', order).pipe(
      map( res => res.json() )
    );  
  }

  //  --- Stats --------------- /
  getStats() {
    return this.http.get(this.api.url + 'stats').pipe(
      map( res => res.json() )
    )    
  }
}
