import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserDto } from '../../../../../shared/models/user.dto';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserFormDto } from '../../../../../core/services/user/models/user-form.dto';
import { UserService } from '../../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  @Output() userUpdated = new EventEmitter<void>();

  user: UserDto | null = null;
  errorMessage: string = '';

  constructor(public modalRef: BsModalRef, private userService: UserService) {}

  onUserUpdated(user: UserFormDto): void {
    if (this.user) {
      this.userService.updateUser(this.user.id, user).subscribe({
        next: () => {
          this.userUpdated.emit();
          this.hideModal();
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          console.error('Error updating user:', error);
        },
      });
    }
  }

  hideModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  onCancel(): void {
    this.hideModal();
  }
}
