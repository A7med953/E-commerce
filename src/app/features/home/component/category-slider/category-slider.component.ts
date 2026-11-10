import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CategoriesService } from '../../../category/services/categories.service';
import { Category } from '../../../category/models/category';

@Component({
  selector: 'app-category-slider',
  imports: [],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.css'
})
export class CategorySliderComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  // Currently selected category id (null = all products)
  @Input() selectedId: string | null = null;
  @Output() selectCategory = new EventEmitter<Category | null>();

  categories: Category[] = [];

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => (this.categories = res.data),
    });
  }

  select(category: Category | null) {
    this.selectCategory.emit(category);
  }
}
