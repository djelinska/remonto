import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectListComponent } from '../../project/project-list/project-list.component';
import { ProjectService } from '../../../../../core/services/project/project.service';
import { UserDto } from '../../../../../shared/models/user.dto';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, ProjectListComponent],
  providers: [ProjectService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  selectedProjectName: string | null = null;
  projects$!: Observable<ProjectDto[]>;
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

  redirectToSearch(): void {
    this.router.navigate(['/dashboard/search']);
  }
}
