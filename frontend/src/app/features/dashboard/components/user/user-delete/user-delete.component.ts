import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { UserDto } from '../../../../../shared/models/user.dto';

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

  constructor(
    private profileService: ProfileService,
    public modalRef: BsModalRef
  ) {}

  confirmDelete() {
    this.loading = true;
    this.profileService.deleteUserProfile().subscribe({
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
