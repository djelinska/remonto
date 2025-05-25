import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UserDto } from '../../../../../shared/models/user.dto';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @Input() users: UserDto[] = [];
  @Output() userDeleted = new EventEmitter<string>();
  @Output() userUpdated = new EventEmitter<UserDto>();

  constructor(private modalService: BsModalService) {}

  deleteUser(userId: string): void {
    this.userDeleted.emit(userId);
  }

  openEditUserModal(user: UserDto): void {
    const initialState = {
      user,
    };
    const modalRef: BsModalRef = this.modalService.show(UserEditComponent, {
      class: 'modal-md',
      initialState,
    });

    modalRef.content.userUpdated.subscribe(() => {
      this.userUpdated.emit();
    });
  }
}
