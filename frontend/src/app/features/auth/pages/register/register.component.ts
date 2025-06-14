import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { Component } from '@angular/core';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { passwordStrengthValidator } from '../../../../shared/validators/password-strength.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form: FormGroup;
  errorMessage: string = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        passwordStrengthValidator(),
      ]),
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
  if (this.form.valid) {
    const registrationData = {
      ...this.form.value,
      email: this.form.value.email.toLowerCase() 
    };
    
    this.authService.register(registrationData).subscribe({ 
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      },
    });
  }
  }
}
