import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environment/environments.prod';
import { AuthService } from '../../../core/auth/services/auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private updateCartCount(res: any): void {
    const totalCount = res.data.products.reduce(
      (total: number, item: any) => total + item.count,
      0,
    );

    this.cartCountSubject.next(totalCount);
  }

  addProductToCart(productId: string): Observable<any> {
    return this.http
      .post<any>(
        environments.baseUrlV2 + 'cart',
        { productId },
       )
      .pipe(
        tap((res) => {
          this.updateCartCount(res);
        }),
      );
  }

  updateCartQuantity(productId: string, count: number): Observable<any> {
    return this.http
      .put<any>(
        environments.baseUrlV2 + 'cart/' + productId,
        { count },
      )
      .pipe(
        tap((res) => {
          this.updateCartCount(res);
        }),
      );
  }

  getLoggedUserCart(): Observable<any> {
    return this.http
      .get<any>(
        environments.baseUrlV2 + 'cart',
      )
      .pipe(
        tap((res) => {
          this.updateCartCount(res);
        }),
      );
  }

  removeCartItem(productId: string): Observable<any> {
    return this.http
      .delete<any>(
        environments.baseUrlV2 + 'cart/' + productId,
      )
      .pipe(
        tap((res) => {
          this.updateCartCount(res);
        }),
      );
  }

  clearCart(): Observable<any> {
    return this.http
      .delete<any>(
        environments.baseUrlV2 + 'cart/',
      )
      .pipe(
        tap(() => {
          this.cartCountSubject.next(0);
        }),
      );
  }
}