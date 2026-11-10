import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkoutForm!: FormGroup;
  resMsg: string = '';
  isLoading = false;
  cartId!: string;
  ngOnInit(): void {
    this.getCartId();
    this.formInit();
  }

  private readonly orderService = inject(OrderService); 
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  formInit() {
    this.checkoutForm = this.fb.group({
      details: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }
  getCartId() {
    this.activatedRoute.paramMap.subscribe({
      next: (data) => {
        this.cartId = data.get('id')!;
      },
    });
  }

submitForm(): void {
  if (this.checkoutForm.invalid) {
    this.checkoutForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  this.orderService
    .creatCheckOut(this.cartId, this.checkoutForm.value)
    .subscribe({
      next: (res) => {
        console.log(res);

        this.isLoading = false;

        open(res.session.url, '_self');
      },

      error: (err) => {
        console.log(err);

        this.isLoading = false;
        this.resMsg = 'Something went wrong. Please try again.';
      },
    });
}
}
