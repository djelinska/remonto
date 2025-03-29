import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/models/user';
import { UserService } from '../../../../../core/services/user/user.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnInit {
  user$!: Observable<User>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();

    this.userService.getUserUpdatedListener().subscribe(() => {
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    this.user$ = this.userService.getUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
