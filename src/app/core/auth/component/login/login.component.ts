import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
resMsg: string = '';

  isLoading = false;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  showRePassword = false;

  authForm = new FormGroup(
    {

      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        ),
      ]),

    },
  );

  submitForm() {
    this.isLoading = true;
    if (this.authForm.valid) {
      console.log(this.authForm.value);

this.authService.login(this.authForm.value).subscribe({
next: (res) => {
  console.log(res);

  this.isLoading = false;

  if (res.message === 'success') {
    this.authService.saveToken(res.token);
    this.router.navigate(['/home']);
  }
},

  error: ({ error }) => {
    console.log(error);

    this.resMsg = error.message;
    this.isLoading = false;
  }
});

    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
