import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'validation',
  imports: [],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent {
@Input() controls!:AbstractControl | null
authForm: any;
}
