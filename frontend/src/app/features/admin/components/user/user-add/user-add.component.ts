import { Component, EventEmitter, Output } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserFormDto } from '../../../../../core/services/user/models/user-form.dto';
import { UserService } from '../../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss',
})
export class UserAddComponent {
  @Output() userAdded = new EventEmitter<void>();

  constructor(public modalRef: BsModalRef, private userService: UserService) {}

  onUserAdded(user: UserFormDto): void {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.userAdded.emit();
        this.hideModal();
      },
      error: (error) => {
        console.error('Error adding user:', error);
      },
    });
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
