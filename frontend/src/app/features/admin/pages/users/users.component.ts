import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Component } from '@angular/core';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { UserAddComponent } from '../../components/user/user-add/user-add.component';
import { UserDto } from '../../../../shared/models/user.dto';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: UserDto[] = [];
  modalRef!: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  openAddUserModal(): void {
    const modalRef: BsModalRef = this.modalService.show(UserAddComponent, {
      class: 'modal-md',
    });

    modalRef.content.userAdded.subscribe(() => {
      this.loadUsers();
    });
  }

  onDeleteUser(userId: string): void {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Usuń użytkownika',
        message:
          'Czy na pewno chcesz usunąć tego użytkownika? Wszystkie dane zostaną trwale usunięte.',
        btnTitle: 'Usuń',
        confirmCallback: () => {
          this.deleteUser(userId);
        },
      },
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      },
    });
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  refreshUsers(): void {
    this.loadUsers();
  }
}
