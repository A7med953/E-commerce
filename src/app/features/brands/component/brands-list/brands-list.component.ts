import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brand';
import { BrandsCardComponent } from '../brands-card/brands-card.component';
import { ProductListComponent } from '../../../product/component/product-list/product-list.component';

@Component({
  selector: 'app-brands-list',
  imports: [BrandsCardComponent, ProductListComponent],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.css'
})
export class BrandsListComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  @ViewChild('productsAnchor') productsAnchor?: ElementRef<HTMLElement>;

  brands: Brand[] = [];
  selectedBrand: Brand | null = null;
  isLoaded = false;

  ngOnInit(): void {
    this.brandsService.getBrands().subscribe({
      next: (res) => {
        this.brands = res.data;
        this.isLoaded = true;
      },
      error: () => (this.isLoaded = true),
    });
  }

  selectBrand(brand: Brand) {
    this.selectedBrand = brand;
    // Wait one tick so the product section renders before scrolling to it
    setTimeout(() =>
      this.productsAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' })
    );
  }
}
