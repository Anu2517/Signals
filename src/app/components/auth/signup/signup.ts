import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth-service';
import { FormBase } from '../../../shared/form-base';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup extends FormBase{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private auth = inject(AuthService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  onSubmit() {
    if (!this.validateForm()) {
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

    const signupEmail = this.f['email'].value!;

    this.auth.signUp({
      name: this.f['name'].value as string,
      userName: this.f['name'].value as string,
      fullName: this.f['name'].value as string,
      email: this.f['email'].value as string,
      password: this.f['password'].value as string,
      age: 25,
      phoneNumber: "0000000000",
      role: "User"
    }).subscribe(success => {

      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Account created Successfully!',
          life: 3000
        });
        this.form.reset();
        this.formSubmitted = false;
        this.router.navigate(['/signin'], {
          state: { email: signupEmail }
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Signup Failed',
          detail: 'User may already exist',
          life: 3000
        });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }

}
