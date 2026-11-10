import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CartService } from '../../../cart/services/cart.service';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

interface FilterOption {
  _id: string;
  name: string;
  count: number;
}

@Component({
  selector: 'app-shop',
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);

  readonly pageSize = 15;

  allProducts: Product[] = [];
  categories: FilterOption[] = [];
  brands: FilterOption[] = [];
  isLoaded = false;
  loadError = false;

  // Filter state
  search = '';
  categoryId = '';
  brandId = '';
  sort: SortKey = 'popular';
  page = 1;

  ngOnInit(): void {
    // Allows links like /products?category=<id>
    const params = this.route.snapshot.queryParamMap;
    this.categoryId = params.get('category') ?? '';
    this.brandId = params.get('brand') ?? '';

    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.categories = this.buildOptions(products, (p) => p.category);
        this.brands = this.buildOptions(products, (p) => p.brand);
        this.isLoaded = true;
      },
      error: () => {
        this.loadError = true;
        this.isLoaded = true;
      },
    });
  }

  // Only categories / brands that really have products appear in the filters
  private buildOptions(
    products: Product[],
    pick: (p: Product) => { _id: string; name: string } | undefined
  ): FilterOption[] {
    const map = new Map<string, FilterOption>();
    for (const p of products) {
      const item = pick(p);
      if (!item?._id) continue;
      const found = map.get(item._id);
      if (found) found.count++;
      else map.set(item._id, { _id: item._id, name: item.name, count: 1 });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  get filtered(): Product[] {
    const term = this.search.trim().toLowerCase();
    const list = this.allProducts.filter(
      (p) =>
        (!term ||
          p.title.toLowerCase().includes(term) ||
          p.category?.name.toLowerCase().includes(term) ||
          p.brand?.name.toLowerCase().includes(term)) &&
        (!this.categoryId || p.category?._id === this.categoryId) &&
        (!this.brandId || p.brand?._id === this.brandId)
    );
    const sorted = [...list];
    switch (this.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
      default:
        sorted.sort((a, b) => b.sold - a.sold);
    }
    return sorted;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pageItems(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get hasFilters(): boolean {
    return !!(this.search || this.categoryId || this.brandId);
  }

  // Any filter change sends the user back to page 1
  onFilterChange() {
    this.page = 1;
  }

  clearFilters() {
    this.search = '';
    this.categoryId = '';
    this.brandId = '';
    this.page = 1;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addProductToCart(id: string) {
    this.cartService.addProductToCart(id).subscribe({
      next: () =>
        this.toastr.success('product added successfully', '', {
          progressBar: true,
          timeOut: 1500,
          closeButton: true,
        }),
    });
  }
}
