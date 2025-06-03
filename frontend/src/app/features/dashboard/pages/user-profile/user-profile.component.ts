import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../../core/services/profile/profile.service';
import { Router } from '@angular/router';
import { UserDeleteComponent } from '../../components/user/user-delete/user-delete.component';
import { UserDto } from '../../../../shared/models/user.dto';
import { UserEditComponent } from '../../components/user/user-edit/user-edit.component';
import { UserPasswordResetComponent } from '../../components/user/user-password-reset/user-password-reset.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user$!: Observable<UserDto>;
  modalRef?: BsModalRef;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.user$ = this.profileService.getUserProfile();
  }

  openEdit(user: UserDto): void {
    const initialState = { user: { ...user } };
    this.modalRef = this.modalService.show(UserEditComponent, {
      class: 'modal-md',
      initialState,
    });

    if (this.modalRef.content) {
      this.modalRef.content.userUpdated.subscribe(() => {
        this.loadUserProfile();
      });
    }
  }

  openDelete(user: UserDto): void {
    const initialState = { user };
    this.modalRef = this.modalService.show(UserDeleteComponent, {
      class: 'modal-md',
      initialState,
    });

    if (this.modalRef.content) {
      this.modalRef.content.userDeleted.subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/']);
      });
    }
  }

  openPasswordReset(user: UserDto): void {
    const initialState = { user };
    this.modalRef = this.modalService.show(UserPasswordResetComponent, {
      class: 'modal-md',
      initialState,
    });

    if (this.modalRef.content) {
      this.modalRef.content.passwordChanged.subscribe(() => {
      });
    }
  }
}
