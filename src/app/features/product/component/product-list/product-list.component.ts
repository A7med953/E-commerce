import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  allProducts: Product[] = [];
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastr= inject(ToastrService)

    showSuccess(msg:string) {
    this.toastr.success(msg,'',{progressBar:true,timeOut:1500,closeButton:true });
  }
  getAllProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data.data;
      },
    });
  }
  addProductToCart(id: string) {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.showSuccess("product added successfully")
      },
    });
  }
  ngOnInit(): void {
    this.getAllProducts();
  }
}
