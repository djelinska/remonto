import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../../../../../shared/models/user.dto'; // Importuj model użytkownika
import { UserService } from '../../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss'],
})
export class UserDeleteComponent {
  @Input() user!: UserDto;
  @Output() userDeleted = new EventEmitter<void>();
  loading = false;
  errorMessage = '';

  constructor(private userService: UserService, public modalRef: BsModalRef) {}

  confirmDelete() {
    this.loading = true;
    this.userService.deleteUserProfile().subscribe({
      next: () => {
        this.loading = false;
        this.userDeleted.emit();
        this.modalRef?.hide();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Błąd podczas usuwania konta';
        console.error(error);
      },
    });
  }
}
