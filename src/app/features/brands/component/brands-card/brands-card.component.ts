import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-brands-card',
  imports: [],
  templateUrl: './brands-card.component.html',
  styleUrl: './brands-card.component.css'
})
export class BrandsCardComponent {
  @Input() brand!: Brand;
  @Input() active = false;
  @Output() pick = new EventEmitter<Brand>();
}
