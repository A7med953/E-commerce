import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ProductListComponent } from '../../../product/component/product-list/product-list.component';
import { ProductsService } from '../../../product/services/products.service';

@Component({
  selector: 'app-category',
  imports: [ProductListComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  @ViewChild('productsAnchor') productsAnchor?: ElementRef<HTMLElement>;

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  isLoaded = false;
  // Product count per category id; null until loaded (then empty ones get blurred)
  counts: Record<string, number> | null = null;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoaded = true;
      },
      error: () => (this.isLoaded = true),
    });
    this.productsService.getProductCounts().subscribe({
      next: (c) => (this.counts = c.categories),
    });
  }

  // Categories that have products first, empty ones after
  get sortedCategories(): Category[] {
    if (!this.counts) return this.categories;
    return [...this.categories].sort((a, b) => Number(this.isEmpty(a)) - Number(this.isEmpty(b)));
  }

  isEmpty(category: Category): boolean {
    return this.counts !== null && !this.counts[category._id];
  }

  selectCategory(category: Category) {
    if (this.isEmpty(category)) return;
    this.selectedCategory = category;
    // Wait one tick so the product section renders before scrolling to it
    setTimeout(() =>
      this.productsAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' })
    );
  }
}
