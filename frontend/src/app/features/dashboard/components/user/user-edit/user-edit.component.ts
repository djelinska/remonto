import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../../../../../shared/models/user.dto';
import { UserService } from '../../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent {
  @Input() user!: UserDto;
  @Output() userUpdated = new EventEmitter<UserDto>();
  loading = false;
  errorMessage = '';

  constructor(private userService: UserService, public modalRef: BsModalRef) {}

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.user.firstName || this.user.firstName.trim().length < 3) {
      this.errorMessage = 'Imię musi mieć co najmniej 3 znaki.';
      return false;
    }

    if (!this.user.lastName || this.user.lastName.trim().length < 3) {
      this.errorMessage = 'Nazwisko musi mieć co najmniej 3 znaki.';
      return false;
    }

    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!this.user.email || !emailPattern.test(this.user.email)) {
      this.errorMessage = 'Niepoprawny format emaila.';
      return false;
    }
    return true;
  }

  saveChanges() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.userService.updateUserProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.userUpdated.emit(updatedUser);
        this.modalRef?.hide();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Błąd podczas aktualizacji użytkownika';
        console.error(error);
      },
    });
  }
}
