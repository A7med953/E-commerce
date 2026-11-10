import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { CategoriesService } from '../../../category/services/categories.service';
import { Category } from '../../../category/models/category';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../product/services/products.service';

@Component({
  selector: 'app-category-slider',
  imports: [RouterLink],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.css'
})
export class CategorySliderComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  @ViewChild('track') track!: ElementRef<HTMLElement>;

  // Currently selected category id (null = all products)
  @Input() selectedId: string | null = null;
  @Output() selectCategory = new EventEmitter<Category | null>();

  categories: Category[] = [];
  // Product count per category id; null until loaded (then empty ones get blurred)
  counts: Record<string, number> | null = null;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => (this.categories = res.data),
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

  // Click a category to filter Home; click it again to go back to Best Sellers
  select(category: Category | null) {
    if (category && this.isEmpty(category)) return;
    const isSame = category && category._id === this.selectedId;
    this.selectCategory.emit(isSame ? null : category);
  }

  scroll(direction: 1 | -1) {
    const el = this.track.nativeElement;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }
}
