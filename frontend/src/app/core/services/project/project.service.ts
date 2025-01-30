import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectBudgetDto } from './models/project-budget.dto';
import { ProjectDto } from '../../../shared/models/project.dto';
import { ProjectFormDto } from './models/project-form.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.apiUrl);
  }

  getProjectById(id: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.apiUrl}/${id}`);
  }

  getProjectBudget(id: string): Observable<ProjectBudgetDto> {
    return this.http.get<ProjectBudgetDto>(`${this.apiUrl}/${id}/budget`);
  }

  createProject(project: ProjectFormDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.apiUrl, project);
  }

  updateProject(id: string, project: ProjectFormDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addImageToProject(projectId: string, imageUrl: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${projectId}/images`, {
      imageUrl,
    });
  }
}
