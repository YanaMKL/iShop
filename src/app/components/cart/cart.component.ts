import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() product: Product
  @Output() OnRemoveFromCart = new EventEmitter();

  cart:Cart;
  customer: User;
  showPayButton = false;
  isOpenCartFound:any = false;
  openCartId:number;

  constructor(
    private cartService:CartService, 
    private authService:AuthService,
    private router:Router
  ) {

    //  get user info
    this.customer = this.authService.getUserDeatils();

    //  check if any cart still open from previous visit
    this.cartService.getOpenCart();
 
    //  is checkout page?
    if(router.url === '/checkout') {
      this.showPayButton = true;
    }

    //  Any open cart from previous visit?
        //  Get Open Cart, (if in browsing mode)
    if(router.url === '/cart') {
      if(this.cartService.openCartId != undefined) {
        this.openCartId = this.cartService.openCartId
        this.isOpenCartFound = true;
      }
    }



  }

  ngOnInit() {

    this.cart = this.cartService.cart;


  }

  removeItem(product) {
    //this.OnRemoveFromCart.emit(product);
    this.cartService.removeItem(product);
    this.cart = this.cartService.cart;
  }

  get total() {

    return this.cartService.total;
  }

  restoreCart() {

    //  remove current cart and use previous cart
    let that = this;
    this.cartService.getCart(this.cartService.openCartId, function(newCart){

      //  remove previous cart
      //  this.cartService.removeCart(that.cart.id);

      //  update current cart with restored cart
      that.cart =  newCart;

      //  remove message
      that.isOpenCartFound = false;
    });
    
  }

}
