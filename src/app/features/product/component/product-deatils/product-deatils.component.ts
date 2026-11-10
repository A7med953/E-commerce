import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-product-deatils',
  imports: [RouterLink],
templateUrl: './product-deatils.component.html',
  styleUrl: './product-deatils.component.css'
})
export class ProductDeatilsComponent {
productId!:string|null
productDetails:Product={}as Product
selectedImage = '';
isLoaded = false;
isAdding = false;
private readonly activtedRouter=inject(ActivatedRoute)
private readonly productsService=inject(ProductsService)
private readonly cartService=inject(CartService)
private readonly toastr=inject(ToastrService)

// Re-load whenever the :id in the URL changes (the first way is the best)
ngOnInit():void{
  this.activtedRouter.paramMap
    .pipe(
      switchMap((urlData) => {
        this.productId = urlData.get('id');
        this.isLoaded = false;
        this.quantity = 1;
        return this.productsService.getProductDetails(this.productId);
      })
    )
    .subscribe({
      next: ({ data }) => {
        this.productDetails = data;
        this.selectedImage = data.imageCover;
        this.isLoaded = true;
      },
      error: () => (this.isLoaded = true),
    });
}

get gallery(): string[] {
  const images = this.productDetails.images ?? [];
  return [this.productDetails.imageCover, ...images].filter(
    (img, i, all) => !!img && all.indexOf(img) === i
  );
}

quantity: number = 1;

increaseQuantity(): void {
  this.quantity++;
}

decreaseQuantity(): void {
  if (this.quantity > 1) {
    this.quantity--;
  }
}

// The API adds one piece; if the user picked more, update the count right after
addToCart(): void {
  this.isAdding = true;
  this.cartService
    .addProductToCart(this.productDetails._id)
    .pipe(
      switchMap((res) => {
        const line = res.data.products.find(
          (p: any) => (p.product._id ?? p.product) === this.productDetails._id
        );
        const newCount = (line?.count ?? 1) - 1 + this.quantity;
        return this.cartService.updateCartQuantity(this.productDetails._id, newCount);
      })
    )
    .subscribe({
      next: () => {
        this.isAdding = false;
        this.toastr.success('product added successfully', '', {
          progressBar: true,
          timeOut: 1500,
          closeButton: true,
        });
      },
      error: () => {
        this.isAdding = false;
        this.toastr.error('Could not add the product, please try again');
      },
    });
}
}
