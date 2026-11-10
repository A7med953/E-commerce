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
    const returnURl="?url=http://localhost:4200" //url forntend
    return this.http.post<any>(
      environments.baseUrl + 'orders/checkout-session/' + cartId + returnURl,
      {
        shippingAddress
      },

    );
  }
}