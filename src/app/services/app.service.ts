import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

    public productsSubject = new Subject();


    getProducts(categoryid){
        this.productsSubject.next(categoryid);
    }

}