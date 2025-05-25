import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { UserDto } from '../../../../../shared/models/user.dto';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnInit {
  user$!: Observable<UserDto>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();

    this.profileService.getUserUpdatedListener().subscribe(() => {
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    this.user$ = this.profileService.getUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
