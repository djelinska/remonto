import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  private projectsSubject = new BehaviorSubject<Project[] | null>(null);

  projects$ = this.projectsSubject.asObservable();

  constructor(private projectService: ProjectService) {}

  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projectsSubject.next(projects);
    });
  }

  refreshProjects(): Observable<Project[]> {
    return this.projectService
      .getProjects()
      .pipe(tap((projects) => this.projectsSubject.next(projects)));
  }
}
