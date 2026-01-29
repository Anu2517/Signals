import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule,InputTextModule, ButtonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {

  signupForm!: FormGroup; 
  formSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router, private messageService: MessageService, private auth: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please fix the form errors',
        life: 3000
      });

      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Password Error',
        detail: 'Passwords do not match',
        life: 3000
      });
      return;
    }

    this.auth.signUp({
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    });

    this.messageService.add({ severity: 'success', summary: 'Account created Successfully! Please login', life: 3000 });
    this.signupForm.reset();
    this.formSubmitted = false;
      this.router.navigate(['/signin']);
  }

  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }
  
}
