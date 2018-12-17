import { Component, OnInit,Injectable, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cart:Cart;
  private _user:User;

  _openCartId = 0;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ){ 

    this._user = this.authService.getUserDeatils();

    //  Create cart
    this.create();

    //  Get Open Cart, (if in browsing mode)
    if(router.url === '/cart')
      this.getOpenCart();
  }

  getOpenCart() {
    this.dataService.getOpenCart(this._user.id).subscribe(response => {
      
      if(response.success) {
        this._openCartId = response.data.cartId;
      } 
    })
  }

  create() {

    //  Log
    console.log('Initiating cart...');

    //  Create a new empty cart
    this._cart = { products: [] };
    this._cart.customerId = this._user.id ; 

    //  Create a new cart through API
    console.log(`Initiating cart for customer ${this._cart.customerId}`);
    this.dataService.createCart(this._cart).subscribe( response => {
      if(response.success) {

        console.log(`Cart initiated successfully`);
        this._cart.id = response.data.id;
        this._cart.products = response.data.products || [];

      }
    })
  }

  getCart(cartId: number, callback) {

    if(cartId != undefined) {
      this.dataService.getCart(cartId).subscribe( response => {
        if(response.success)  {
          this._cart = response.data;

          if(typeof callback == 'function') {
            callback(this._cart);
          }
        }
      })
    }
  }

  addItem(product: Product) {

    console.log(`Adding ${product.name} to cart...`);

    //  Check if product already exist in cart
    //  if yes, increment quantity
    let exists = false;
    var qty = 1;

    for(let i=0; i < this._cart.products.length; i++ ){
      if(this._cart.products[i].id === product.id ) {
        console.log(`Product already exists in cart, quantity updated`);
        exists = true;
        qty = Number(this._cart.products[i].qty) + 1; 
      }
    }

    //  if no, add product to cart
    if(!exists) {
      this._cart.products.push(product);
      console.log(`Product added successfully`);
    }

    //  Update server through API with product quantity
    
    let cartItem = {
      cartId: this._cart.id,
      productId: product.id,
      qty: qty
    }

    this.dataService.upsertProduct(cartItem).subscribe( response => {
      if(response.success) {
        // Server updated succesfully
        product.qty = qty;
      } else {
        alert('There was an error accessing the server');
      }

      // Update Cart Info
      // this.updateCartInfo(cartItem.cartId);
    }) 

  }

  removeItem(product: Product) {
      //  Create cart-product object
      let cartObj = {
        cartId: this._cart.id,
        productId:product.id
      }
  
      //  Remove Product from Cart through API
      console.log('Removing product ' + product.id + '...');
      this.dataService.removeProduct(cartObj).subscribe(response=>{
        if(response.success) {
          //  Successfully Removed
          console.log('Product removed');
  
          // Remove from products array
          for(let i=0; i < this._cart.products.length; i++)
            if(this._cart.products[i].id === product.id) {
              this._cart.products.splice(i,1); 
              break;
            }
  
          // Removed Successfully
        } else {
          alert('There was an error accessing the server');
        }
      })
  }

  updateCartInfo(cartId: number) {
    
        //  Get Cart Details
        console.log(`Retreving cart # ${cartId} from server...`);
        
        this.dataService.getCart(cartId).subscribe( response => {
          if(response.success) {

            //  Cart received successfully
            this._cart = response.data;
    
          } else {
            alert('There was an error accessing the server');
          }
        })
  
  }

  private setTotal_() {

    let total = 0;
    
    if(this._cart.id != undefined) {
      this._cart.products.forEach( product => {
        total += (product.price * product.qty);
      });
    }
    
    this._cart.total = total;

  }

  get total() {

    let total = 0;
    
    if(this._cart.id != undefined) {
      this._cart.products.forEach( product => {
        total += (product.price * product.qty);
      });
    }
    
    this._cart.total = total;

    return this._cart.total;
  }

  get cart() {
    return this._cart;
  }

  get lastOrder() {
    return 'Nov 2018'
  }

  get openCartId() {
    return this._openCartId;
  }
}
