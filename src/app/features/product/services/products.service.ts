import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { environments } from '../../../../environment/environment';
import { Product } from '../models/product';

export interface ProductFilter {
  category?: string | null;
  brand?: string | null;
  sort?: string | null; // e.g. '-sold', 'price', '-price'
  limit?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // Cached list of every product, shared by the Shop page and the empty-category check
  private allProducts$?: Observable<Product[]>;

  constructor(private httpClient:HttpClient) { }
  getProducts(filter: ProductFilter = {}):Observable<any>{
    let params = new HttpParams();
    if (filter.category) params = params.set('category', filter.category);
    if (filter.brand) params = params.set('brand', filter.brand);
    if (filter.sort) params = params.set('sort', filter.sort);
    if (filter.limit) params = params.set('limit', filter.limit);
    return this.httpClient.get(environments.baseUrl+'products', { params })
  }

  // The API returns at most 50 products per page, so load every page once and cache it
  getAllProducts(): Observable<Product[]> {
    if (!this.allProducts$) {
      const page = (p: number) =>
        this.httpClient.get<any>(environments.baseUrl + 'products', {
          params: { limit: 50, page: p },
        });
      this.allProducts$ = page(1).pipe(
        switchMap((first) => {
          const pages = first.metadata?.numberOfPages ?? 1;
          if (pages <= 1) return of(first.data as Product[]);
          const rest = Array.from({ length: pages - 1 }, (_, i) => page(i + 2));
          return forkJoin(rest).pipe(
            map((others) => [...first.data, ...others.flatMap((r) => r.data)] as Product[])
          );
        }),
        shareReplay(1)
      );
    }
    return this.allProducts$;
  }

  // How many products each category / brand has, keyed by its _id
  getProductCounts(): Observable<{ categories: Record<string, number>; brands: Record<string, number> }> {
    return this.getAllProducts().pipe(
      map((products) => {
        const categories: Record<string, number> = {};
        const brands: Record<string, number> = {};
        for (const p of products) {
          if (p.category?._id) categories[p.category._id] = (categories[p.category._id] ?? 0) + 1;
          if (p.brand?._id) brands[p.brand._id] = (brands[p.brand._id] ?? 0) + 1;
        }
        return { categories, brands };
      })
    );
  }

  getProductDetails(id:string|null):Observable<any>{
    return this.httpClient.get(environments.baseUrl+`products/${id}`)
  }
}
