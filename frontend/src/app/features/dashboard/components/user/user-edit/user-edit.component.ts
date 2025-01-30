import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../../shared/models/user';
import { UserService } from '../../../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent {
  @Input() user!: User;
  @Output() userUpdated = new EventEmitter<User>();
  loading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  saveChanges() {
    this.loading = true;
    this.userService.updateUserProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.userUpdated.emit(updatedUser);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Błąd podczas aktualizacji użytkownika';
        console.error(error);
      },
    });
  }
}