import { Component, Output, EventEmitter, Input } from '@angular/core';
import { UserService } from '../../../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../shared/models/user'; // Importuj model użytkownika
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss'],
})
export class UserDeleteComponent {
  @Input() user!: User;
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
