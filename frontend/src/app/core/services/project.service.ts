import { BehaviorSubject, Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MOCK_PROJECTS } from '../../mock-data';
import { Project } from '../../shared/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    // return this.http.get<Project[]>(this.apiUrl, { withCredentials: true });
    return of(MOCK_PROJECTS);
  }

  getProjectById(id: number): Observable<any> {
    // return this.http.get<Project>(`${this.apiUrl}/${id}`, {
    //   withCredentials: true,
    // });
    const project = MOCK_PROJECTS.find((p) => p.id === id);
    return of(project);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, {
      withCredentials: true,
    });
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, {
      withCredentials: true,
    });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
