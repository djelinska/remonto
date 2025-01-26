import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolDto } from '../../../shared/models/tool.dto';
import { ToolFormDto } from './models/tool-form.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getToolsByProject(projectId: string): Observable<ToolDto[]> {
    return this.http.get<ToolDto[]>(
      `${this.apiUrl}/projects/${projectId}/tools`
    );
  }

  getToolByProject(projectId: string, toolId: string): Observable<ToolDto[]> {
    return this.http.get<ToolDto[]>(
      `${this.apiUrl}/projects/${projectId}/tools/${toolId}`
    );
  }

  addToolToProject(projectId: string, tool: ToolFormDto): Observable<ToolDto> {
    return this.http.post<ToolDto>(
      `${this.apiUrl}/projects/${projectId}/tools`,
      tool
    );
  }

  updateToolInProject(
    projectId: string,
    toolId: string,
    tool: ToolFormDto
  ): Observable<ToolDto> {
    return this.http.put<ToolDto>(
      `${this.apiUrl}/projects/${projectId}/tools/${toolId}`,
      tool
    );
  }

  deleteToolFromProject(projectId: string, toolId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/projects/${projectId}/tools/${toolId}`
    );
  }
}
