import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Material } from '../../../shared/models/material.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMaterialsByProject(projectId: string): Observable<any[]> {
    projectId = '677c811b6da0ff7787ea640e';
    console.log('Project ID:', projectId);
    console.log(typeof projectId);
    console.log(`${this.apiUrl}/projects/${projectId}/materials`);
    return this.http.get<Material[]>(
      `${this.apiUrl}/projects/${projectId}/materials`,
      {
        withCredentials: true,
      }
    );
  }
}
