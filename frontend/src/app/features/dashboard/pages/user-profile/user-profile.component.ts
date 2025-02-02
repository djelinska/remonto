import { Router, RouterLink } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../shared/models/user';
import { UserService } from '../../../../core/services/user/user.service';
import { UserEditComponent } from '../../components/user/user-edit/user-edit.component';
import { UserDeleteComponent } from '../../components/user/user-delete/user-delete.component';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UserEditComponent, UserDeleteComponent, RouterLink],
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
      class: 'modal-lg',
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
