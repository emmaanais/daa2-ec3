import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container d-flex flex-column align-items-center justify-content-center" style="min-height: 100vh;">
      <div class="card p-4" style="min-width: 320px; max-width: 360px;">
        <h3 class="mb-4 text-center">Registro</h3>
        <form [formGroup]="form" (ngSubmit)="register()" novalidate>
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
          <div class="mb-3">
            <label class="form-label">Confirmar contraseña</label>
            <input type="password" formControlName="confirmPassword" class="form-control" [class.is-invalid]="confirmPassword.invalid && (confirmPassword.dirty || confirmPassword.touched) || form.hasError('passwordMismatch')">
            <div class="invalid-feedback" *ngIf="confirmPassword.errors?.['required']">Repite la contraseña</div>
            <div class="invalid-feedback" *ngIf="form.hasError('passwordMismatch')">Las contraseñas no coinciden</div>
          </div>
          <button type="submit" class="btn btn-success w-100" [disabled]="form.invalid || loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
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
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async register() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    try {
      await this.authService.register(email, password);
      this.toastr.success('Usuario registrado con éxito');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toastr.error('Error en el registro');
    }
    this.loading = false;
  }
}
