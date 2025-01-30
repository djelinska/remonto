import { Component, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss'],
})
export class UserDeleteComponent {
  @Output() userDeleted = new EventEmitter<void>();
  loading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  confirmDelete() {
    if (confirm('Czy na pewno chcesz usunąć konto?')) {
      this.loading = true;
      this.userService.deleteUserProfile().subscribe({
        next: () => {
          this.loading = false;
          this.userDeleted.emit();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Błąd podczas usuwania konta';
          console.error(error);
        },
      });
    }
  }
}