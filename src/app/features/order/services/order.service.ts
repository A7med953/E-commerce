import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../../environment/environment';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  creatCheckOut(
    cartId: string,
    shippingAddress: {
      details: string;
      phone: string;
      city: string;
    },
  ): Observable<any> {
    // Where Stripe sends the user back after paying: this app's own address
    // (localhost while developing, the GitHub Pages URL when deployed)
    const appUrl = document.baseURI.replace(/\/$/, '');
    const returnURl = '?url=' + encodeURIComponent(appUrl);
    return this.http.post<any>(
      environments.baseUrl + 'orders/checkout-session/' + cartId + returnURl,
      {
        shippingAddress
      },

    );
  }

  getUserOrders(userId: string): Observable<any> {
    return this.http.get<any>(environments.baseUrl + 'orders/user/' + userId);
  }
}
