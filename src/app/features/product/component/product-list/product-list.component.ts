import { Component, Input, OnChanges, inject } from '@angular/core';
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
export class ProductListComponent implements OnChanges {
  // Optional filters: when set, only products of this category / brand are shown
  @Input() title = 'Popular Products';
  @Input() categoryId: string | null = null;
  @Input() brandId: string | null = null;

  allProducts: Product[] = [];
  isLoaded = false;
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastr= inject(ToastrService)

    showSuccess(msg:string) {
    this.toastr.success(msg,'',{progressBar:true,timeOut:1500,closeButton:true });
  }
  getAllProducts() {
    this.isLoaded = false;
    this.productsService
      .getProducts({ category: this.categoryId, brand: this.brandId })
      .subscribe({
        next: (data) => {
          this.allProducts = data.data;
          this.isLoaded = true;
        },
        error: () => {
          this.allProducts = [];
          this.isLoaded = true;
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
  // Runs on first render and every time a filter input changes
  ngOnChanges(): void {
    this.getAllProducts();
  }
}
