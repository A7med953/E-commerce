import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/cart.interface';

@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  @Input() product: Product={} as Product
  @Output() removeProduct=new EventEmitter <string>()
  @Output() updateProduct=new EventEmitter <{id:string,newCount:number}>()
  onRemove(){
    this.removeProduct.emit(this.product.product.id)

  }
  onUpdateQty(newCount:number){
    this.updateProduct.emit({id:this.product.product.id,newCount})
  }
}
 