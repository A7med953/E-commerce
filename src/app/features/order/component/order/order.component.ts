import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-order',
  imports: [DatePipe, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  orders: any[] = [];
  isLoaded = false;

  ngOnInit(): void {
    // Stripe sends the user here after paying; the cart was emptied, so refresh the badge
    this.cartService.getLoggedUserCart().subscribe({ error: () => {} });

    const userId = this.authService.getUserId();
    if (!userId) {
      this.isLoaded = true;
      return;
    }
    this.orderService.getUserOrders(userId).subscribe({
      next: (res) => {
        // Newest order first
        this.orders = [...res].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoaded = true;
      },
      error: () => (this.isLoaded = true),
    });
  }
}
