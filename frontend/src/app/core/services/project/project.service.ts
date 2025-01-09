import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRequest } from './models/project-request';
import { ProjectResponse } from './models/project-response';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(this.apiUrl);
  }

  getProjectById(id: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.apiUrl}/${id}`);
  }

  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.apiUrl, project);
  }

  updateProject(
    id: string,
    project: ProjectRequest
  ): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
