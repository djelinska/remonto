import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { UserDto } from '../../../../../shared/models/user.dto';

@Component({
  selector: 'app-user-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-password-reset.component.html',
  styleUrls: ['./user-password-reset.component.scss'],
})
export class UserPasswordResetComponent {
  @Input() user!: UserDto;
  @Output() passwordChanged = new EventEmitter<void>();
  loading = false;
  errorMessage = '';
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;


  constructor(
    private profileService: ProfileService,
    public modalRef: BsModalRef
  ) {}

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.passwordData.currentPassword) {
      this.errorMessage = 'Podaj aktualne hasło';
      return false;
    }

    if (!this.passwordData.newPassword || this.passwordData.newPassword.length < 6) {
      this.errorMessage = 'Nowe hasło musi mieć 6 znaków';
      return false;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'Nowe hasło różni się od powtórzenia';
      return false;
    }

    if (this.passwordData.currentPassword === this.passwordData.newPassword) {
      this.errorMessage = 'Nowe hasło musi być inne od starego';
      return false;
    }

    if (!/[A-Z]/.test(this.passwordData.newPassword)) {
      this.errorMessage = 'Hasło musi zawierać przynajmniej jedną wielką literę';
      return false;
    }

    if (!/[0-9]/.test(this.passwordData.newPassword)) {
      this.errorMessage = 'Hasło musi zawierać przynajmniej jedną cyfrę';
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.passwordData.newPassword)) {
        this.errorMessage = 'Hasło musi zawierać przynajmniej jeden znak specjalny';
        return false;
    }

    return true;
  }

  resetPassword() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.profileService.changePassword(
      this.passwordData.currentPassword, 
      this.passwordData.newPassword
    ).subscribe({
      next: () => {
        this.loading = false;
        this.passwordChanged.emit();
        this.modalRef?.hide();
      },
      // error: (error) => {
      //   this.loading = false;
      //   if (error.error?.message) {
      //     this.errorMessage = error.error.message;
      //   } else if (error.status === 401) {
      //     this.errorMessage = 'Current password is incorrect';
      //   } else if (error.status === 400) {
      //     this.errorMessage = 'Invalid password data';
      //   } else {
      //     this.errorMessage = 'Error changing password';
      //   }
      //   console.error(error);
      // }
    });
  }
}