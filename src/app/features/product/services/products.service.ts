import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../../environment/environment';

export interface ProductFilter {
  category?: string | null;
  brand?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient:HttpClient) { }
  getProducts(filter: ProductFilter = {}):Observable<any>{
    let params = new HttpParams();
    if (filter.category) params = params.set('category', filter.category);
    if (filter.brand) params = params.set('brand', filter.brand);
    return this.httpClient.get(environments.baseUrl+'products', { params })
  }
  getProductDetails(id:string|null):Observable<any>{
    return this.httpClient.get(environments.baseUrl+`products/${id}`)
  }
}
