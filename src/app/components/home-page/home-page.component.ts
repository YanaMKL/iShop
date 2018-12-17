import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import '../../interfaces/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  totalOrders: number;
  totalProducts: number;

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataService.getStats().subscribe(response=>{
      if(response.success) {
        this.totalOrders = response.data.totalOrders,
        this.totalProducts = response.data.totalProducts
      }
    })
  }

}