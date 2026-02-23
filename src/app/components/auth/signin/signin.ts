import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth-service';
import { FormBase } from '../../../shared/form-base';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
  providers: [MessageService],
})
export class Signin extends FormBase implements OnInit {
  form!: FormGroup;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    const emailFromSignup = history.state?.email;

    if (emailFromSignup) {
      this.form.patchValue({
        email: emailFromSignup
      });
    }
  }

  login(): void {
    if (!this.validateForm()) return;

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe(success => {
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid email or password',
          life: 3000
        });
      }
    });
  }
}
