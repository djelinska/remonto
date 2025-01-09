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
    // projectId = '677c811b6da0ff7787ea640e';
    console.log('Project ID:', projectId);
    console.log(typeof projectId);
    console.log(`${this.apiUrl}/projects/${projectId}/tools`);
    return this.http.get<Tool[]>(`${this.apiUrl}/projects/${projectId}/tools`, {
      withCredentials: true,
    });
  }
}
