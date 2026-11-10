import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getCategories(): Observable<any> {
    return this.httpClient.get(environments.baseUrl + 'categories');
  }

  getCategory(id: string): Observable<any> {
    return this.httpClient.get(environments.baseUrl + `categories/${id}`);
  }
}
