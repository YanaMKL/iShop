import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  customer: {}

  constructor(
    private dataService: DataService,
    private authServuce: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {

    this.customer = this.authServuce.getUserDeatils();

  }

  checkout(ev) {
    
        //  Prevent default submit action
        ev.preventDefault();

        //  Validate
        //  1. Address
        //  2. City
        //  3. Credit Card


        //  Vildate Address
        if(!ev.target.address.value.length) {
          alert('Please enter address');
          ev.target.address.focus();
          return;
        }

        //  Vildate Address
        if(!ev.target.city.selectedIndex) {
          alert('Please select a city');
          ev.target.city.focus();
          return;
        }

        if(!ev.target.address.value.length) {
          alert('Please enter address');
          ev.target.address.focus();
          return;
        }

        if(ev.target.ccNumber.value.length < 8) {
          alert('Please enter a valid credit card number');
          ev.target.ccNumber.focus();
          return;
        }

        //  Validation OK, now creat an order through the API

        

        let newOrder = {

          cartId: this.cartService.cart.id,
          delivery_address: ev.target.address.value,
          delivery_city: ev.target.city.value,
          delivery_time: ev.target.deliveryTime.value,
          list4Digits: ev.target.ccNumber.value

        }

        this.dataService.createOrder(newOrder).subscribe( response => {
          if(response.success) {
            alert('Thank you!\nYour order number is ' + response.data.id);
          }
        })

  }

}
