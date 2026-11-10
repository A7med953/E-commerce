import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnChanges {
  // Optional filters: when set, only products of this category / brand are shown
  @Input() title = 'Popular Products';
  @Input() categoryId: string | null = null;
  @Input() brandId: string | null = null;
  @Input() sort: string | null = null;
  @Input() limit: number | null = null;
  // When true, shows a "View all" link to the Shop page next to the title
  @Input() showViewAll = false;

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
      .getProducts({
        category: this.categoryId,
        brand: this.brandId,
        sort: this.sort,
        limit: this.limit,
      })
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
  // First load (also runs when the component is used as a route with no inputs)
  ngOnInit(): void {
    this.getAllProducts();
  }
  // Reload when a filter input changes after the first load
  ngOnChanges(changes: SimpleChanges): void {
    const changed = Object.values(changes).some((c) => !c.firstChange);
    if (changed) this.getAllProducts();
  }
}
