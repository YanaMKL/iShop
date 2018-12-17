import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CartService } from '../../../services/cart.service';
import '../../../interfaces/interfaces';

@Component({
  selector: 'categories-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CategoriesListComponent implements OnInit {

  products: Product[];
  categories:Category[];
  categoryForm:boolean;
  category: Category;
  totalToPay: number;

  keyword:string;

  constructor(
    private dataService:DataService,
    private cart:CartService
  ){

    this.keyword = '';

    this.category = {
      id: 1,
      name: 'Top'
    }

    //  Array of products
    this.products = [];

    this.getCategories();


    this.categoryForm = false;


    //  Display products of default category
    this.getProducts(1);

  }

  ngOnInit() {
    console.log('%c on init','color: orange');
  }

  getCategories(){

    console.log('%c Getting categories from API...','color: orange');
    this.dataService.getCategories().subscribe( response => {
      this.categories = response.data;
    });

  }

  addCategory() {

    //  Create a new category object
    let newCategory = {
      id: undefined,
      name: this.category.name
    }

  }



  calcTotal(){
      //  Calculate Total Price
      this.totalToPay = this.cart.total;
  }

  //  Search products by category

  search() {

    //  get products by keyword 
    this.dataService.getProductsByKeyword(this.keyword).subscribe( response => {
      if(response.success)
        this.products = response.data;
    })

  }

  getProducts(categoryid:number) {

    //  Set Current Category
    this.dataService.getCategory(categoryid).subscribe( response => {
      
      if(response.success) {
        this.category = response.data;
      } else {
        alert('There was an error accessing the server');
      }
    });   

    // Get Products of Current Categories     
    this.dataService.getProductsByCategory(categoryid).subscribe( response => {
      if(response.success)
        this.products = response.data;
    })
  }

  saveCategory(){

    let category = {
      id: this.category.id,
      name: this.category.name
    }

    if(category.id) {

      //  Update existing category
      this.dataService.updateCategory(category).subscribe( response => {
        if(response.success) {
          
          //  update category in array of categories
          for(let i=0; i < this.categories.length; i++)
            if(this.categories[i].id === category.id) {
              this.categories[i] = category;
              break;
            }

        } else {
          alert('There was an error accessing the server');
        }
      });
    } else {

      //  Add new category
      this.dataService.addCategory(category).subscribe( response => {
        
        if(response.success) {
          this.categories.push(response.data);
        } else {
          alert('There was an error accessing the server');
        }
      });
    }
  }

  editCategory(id:number){

    this.dataService.getCategory(id).subscribe( response => {
      
      if(response.success) {
        this.category = response.data;
      } else {
        alert('There was an error accessing the server');
      }
    });   
  }


  

  removeFromCart(product: Product) {

    this.cart.removeItem(product)

  }

  addToCart(product: Product){

    this.cart.addItem(product)

  } 
}