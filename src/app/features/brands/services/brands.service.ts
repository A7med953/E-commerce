import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { environments } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  private getBrandsPage(page: number): Observable<any> {
    return this.httpClient.get(environments.baseUrl + 'brands', {
      params: { limit: 50, page },
    });
  }

  // The API returns at most 50 brands per page, so load every page and merge them
  getBrands(): Observable<any> {
    return this.getBrandsPage(1).pipe(
      switchMap((first) => {
        const pages = first.metadata?.numberOfPages ?? 1;
        if (pages <= 1) return of(first);
        const rest = Array.from({ length: pages - 1 }, (_, i) => this.getBrandsPage(i + 2));
        return forkJoin(rest).pipe(
          map((others) => ({
            ...first,
            data: [...first.data, ...others.flatMap((r) => r.data)],
          }))
        );
      })
    );
  }

  getBrand(id: string): Observable<any> {
    return this.httpClient.get(environments.baseUrl + `brands/${id}`);
  }
}
