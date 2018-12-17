import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @Input() product: Product;
  @Output() OnAddToCart = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  showProducts(categoryid) {
    alert(categoryid);
  }

  addToCart(product: Product) {
    console.log('adding product ' + product.id);
    this.OnAddToCart.emit(product);
  }

}
