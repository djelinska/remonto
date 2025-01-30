import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../shared/models/user';
import { UserService } from '../../../../core/services/user/user.service';
import { UserEditComponent } from '../../components/user/user-edit/user-edit.component';
import { UserDeleteComponent } from '../../components/user/user-delete/user-delete.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UserEditComponent, UserDeleteComponent,RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  user$!: Observable<User>;
  selectedUser?: User;
  showEditModal = false;
  showDeleteModal = false;

  constructor(private userService: UserService, private router: Router, private authService: AuthService, ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.user$ = this.userService.getUserProfile();
  }

  openEdit(user: User) {
    console.log('Edit button clicked', user);
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  onUserUpdated(updatedUser: User) {
    this.showEditModal = false;
    this.loadUserProfile();
  }

  openDelete() {
    console.log('delete button clicked');
    this.showDeleteModal = true;
  }

  onUserDeleted() {
    this.showDeleteModal = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}