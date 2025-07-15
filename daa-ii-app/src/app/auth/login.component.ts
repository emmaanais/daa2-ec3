

import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  template: `
    <div class="container d-flex flex-column align-items-center justify-content-center" style="min-height: 100vh;">
      <div class="card p-4" style="min-width: 320px; max-width: 360px;">
        <h3 class="mb-4 text-center">Iniciar sesión</h3>
        <form [formGroup]="form" (ngSubmit)="login()" novalidate>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" formControlName="email" class="form-control" [class.is-invalid]="email.invalid && (email.dirty || email.touched)">
            <div class="invalid-feedback" *ngIf="email.errors?.['required']">Email requerido</div>
            <div class="invalid-feedback" *ngIf="email.errors?.['email']">Email inválido</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" formControlName="password" class="form-control" [class.is-invalid]="password.invalid && (password.dirty || password.touched)">
            <div class="invalid-feedback" *ngIf="password.errors?.['required']">Contraseña requerida</div>
            <div class="invalid-feedback" *ngIf="password.errors?.['minlength']">Mínimo 6 caracteres</div>
          </div>
         <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid || loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
      <div class="mt-3 d-flex flex-column align-items-center gap-2">
        <a routerLink="/register" class="text-decoration-none">¿No tienes cuenta? <b>Regístrate</b></a>
        <a routerLink="/reset-password" class="text-decoration-none">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  async login() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    try {
      await this.authService.login(email!, password!);
      this.toastr.success('Bienvenido/a');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.toastr.error('Credenciales incorrectas');
    }
    this.loading = false;
  }
}