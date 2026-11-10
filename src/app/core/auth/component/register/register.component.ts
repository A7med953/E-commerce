import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidationComponent } from '../../../../shared/component/validation/validation.component';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, ValidationComponent],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  resMsg: string = '';

  isLoading = false;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  showRePassword = false;

  authForm = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        ),
      ]),
      rePassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        ),
      ]),
    },
    { validators: this.passwordMatchValidators },
  );
  passwordMatchValidators(control: AbstractControl) {
    return control.get('password')?.value === control.get('rePassword')?.value
      ? null
      : { missmatch: true };
  }
  submitForm() {
    this.isLoading = true;
    if (this.authForm.valid) {
      console.log(this.authForm.value);

      this.authService.register(this.authForm.value).subscribe({
        next: (res) => {
          console.log(res);
        this.isLoading = false;
          if (res.message == 'success') {
            this.router.navigate(['/login']);
          }
        },
        error: ({ error }) => {
          console.log(error);
          this.resMsg = error.message;
        this.isLoading = false;
        },
      });
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
