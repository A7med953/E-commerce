import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ProductListComponent } from '../../../product/component/product-list/product-list.component';

@Component({
  selector: 'app-category',
  imports: [ProductListComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  @ViewChild('productsAnchor') productsAnchor?: ElementRef<HTMLElement>;

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  isLoaded = false;

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoaded = true;
      },
      error: () => (this.isLoaded = true),
    });
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    // Wait one tick so the product section renders before scrolling to it
    setTimeout(() =>
      this.productsAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' })
    );
  }
}
