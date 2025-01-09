import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Project } from '../../../../shared/models/project.model';
import { ProjectService } from '../../../../core/services/project/project.service';
import { User } from '../../../../shared/models/user';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  providers: [ProjectService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  selectedProjectName: string | null = null;
  projects$!: Observable<Project[]>;
  user$!: Observable<User>;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.projectService.getProjects();
    this.user$ = this.userService.getUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
