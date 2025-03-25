import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../../../shared/models/user';
import { UserDeleteComponent } from '../../components/user/user-delete/user-delete.component';
import { UserEditComponent } from '../../components/user/user-edit/user-edit.component';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user$!: Observable<User>;
  modalRef?: BsModalRef;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.user$ = this.userService.getUserProfile();
  }

  openEdit(user: User): void {
    const initialState = { user: { ...user } }; // Kopia obiektu użytkownika
    this.modalRef = this.modalService.show(UserEditComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    if (this.modalRef.content) {
      this.modalRef.content.userUpdated.subscribe(() => {
        this.loadUserProfile();
      });
    }
  }

  openDelete(user: User): void {
    const initialState = { user };
    this.modalRef = this.modalService.show(UserDeleteComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    if (this.modalRef.content) {
      this.modalRef.content.userDeleted.subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/']);
      });
    }
  }
}
