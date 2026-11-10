import { Component } from '@angular/core';
import { ProductListComponent } from "../../../product/component/product-list/product-list.component";
import { MainSliderComponent } from "../main-slider/main-slider.component";
import { CategorySliderComponent } from '../category-slider/category-slider.component';
import { Category } from '../../../category/models/category';

@Component({
  selector: 'app-home',
  imports: [ProductListComponent, MainSliderComponent, CategorySliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedCategory: Category | null = null;

  onSelectCategory(category: Category | null) {
    this.selectedCategory = category;
  }
}
