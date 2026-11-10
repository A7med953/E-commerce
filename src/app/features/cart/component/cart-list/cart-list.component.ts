import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.interface';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-list',
  imports: [CartItemComponent, RouterLink],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.css',
})
export class CartListComponent implements OnInit {
  cartDetails: Cart = {} as Cart;
  isLoading: boolean = true;
  private readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails = res;
        this.isLoading = false;
      },

    });
  }
  removeProduct(id: string) {
    this.cartService.removeCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res;
      },
    });
  }
  updateQty(id: string, count: number) {
    this.cartService.updateCartQuantity(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res;
      },
    });
  }
clearAll(): void {
  this.cartService.clearCart().subscribe({
    next: (res) => {
      console.log(res);
      this.loadCart();
    },

  });
}
}
