import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-deatils',
  imports: [],
templateUrl: './product-deatils.component.html',
  styleUrl: './product-deatils.component.css'
})
export class ProductDeatilsComponent {
productId!:string|null  
productDetails:Product={}as Product
private readonly activtedRouter=inject(ActivatedRoute)
private readonly productsService=inject(ProductsService)
getProductId(){
  this.activtedRouter.paramMap.subscribe({
    next:(urlData)=>{ 
       this.productId=urlData.get('id')     //   this to get product by id  
    }
  })
  // console.log(this.activtedRouter.snapshot.params['id'])  the second way but the frist way is the best
  
}
getProductDetails(id:string|null){
  this.productsService.getProductDetails(id).subscribe({
    next:({data})=>{
      this.productDetails=data
    }
  })
}
ngOnInit():void{
  this.getProductId()
  this.getProductDetails(this.productId)

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
}
