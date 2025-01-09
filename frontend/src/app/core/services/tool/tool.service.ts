import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Tool } from '../../../shared/models/tool.model';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getToolsByProject(projectId: string): Observable<any[]> {
    return this.http.get<Tool[]>(`${this.apiUrl}/projects/${projectId}/tools`, {
      withCredentials: true,
    });
  }

  getToolByProject(projectId: string, toolId: string): Observable<any[]> {
    return this.http.get<Tool[]>(
      `${this.apiUrl}/projects/${projectId}/tools/${toolId}`,
      {
        withCredentials: true,
      }
    );
  }

  addToolToProject(projectId: string, tool: Tool): Observable<Tool> {
    return this.http.post<Tool>(
      `${this.apiUrl}/projects/${projectId}/tools`,
      tool
    );
  }

  updateToolInProject(
    projectId: string,
    toolId: string,
    tool: Tool
  ): Observable<Tool> {
    return this.http.put<Tool>(
      `${this.apiUrl}/projects/${projectId}/tools/${toolId}`,
      tool,
      {
        withCredentials: true,
      }
    );
  }

  deleteToolFromProject(projectId: string, toolId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/projects/${projectId}/tools/${toolId}`,
      {
        withCredentials: true,
      }
    );
  }
}
