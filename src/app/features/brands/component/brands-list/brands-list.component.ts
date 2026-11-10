import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brand';
import { BrandsCardComponent } from '../brands-card/brands-card.component';
import { ProductListComponent } from '../../../product/component/product-list/product-list.component';
import { ProductsService } from '../../../product/services/products.service';

@Component({
  selector: 'app-brands-list',
  imports: [BrandsCardComponent, ProductListComponent],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.css'
})
export class BrandsListComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);

  @ViewChild('productsAnchor') productsAnchor?: ElementRef<HTMLElement>;

  brands: Brand[] = [];
  selectedBrand: Brand | null = null;
  isLoaded = false;
  // Product count per brand id; null until loaded (then empty ones get blurred)
  counts: Record<string, number> | null = null;

  ngOnInit(): void {
    this.brandsService.getBrands().subscribe({
      next: (res) => {
        this.brands = res.data;
        this.isLoaded = true;
      },
      error: () => (this.isLoaded = true),
    });
    this.productsService.getProductCounts().subscribe({
      next: (c) => (this.counts = c.brands),
    });
  }

  isEmpty(brand: Brand): boolean {
    return this.counts !== null && !this.counts[brand._id];
  }

  // Brands that have products first, empty ones after
  get sortedBrands(): Brand[] {
    if (!this.counts) return this.brands;
    return [...this.brands].sort((a, b) => Number(this.isEmpty(a)) - Number(this.isEmpty(b)));
  }

  selectBrand(brand: Brand) {
    this.selectedBrand = brand;
    // Wait one tick so the product section renders before scrolling to it
    setTimeout(() =>
      this.productsAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' })
    );
  }
}
