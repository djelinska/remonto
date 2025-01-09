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
    return this.http.get<Material[]>(
      `${this.apiUrl}/projects/${projectId}/materials`,
      {
        withCredentials: true,
      }
    );
  }

  getMaterialByProject(
    projectId: string,
    materialId: string
  ): Observable<any[]> {
    return this.http.get<Material[]>(
      `${this.apiUrl}/projects/${projectId}/materials/${materialId}`,
      {
        withCredentials: true,
      }
    );
  }

  addMaterialToProject(
    projectId: string,
    material: Material
  ): Observable<Material> {
    return this.http.post<Material>(
      `${this.apiUrl}/projects/${projectId}/materials`,
      material
    );
  }

  updateMaterialInProject(
    projectId: string,
    materialId: string,
    material: Material
  ): Observable<Material> {
    return this.http.put<Material>(
      `${this.apiUrl}/projects/${projectId}/materials/${materialId}`,
      material,
      {
        withCredentials: true,
      }
    );
  }

  deleteMaterialFromProject(
    projectId: string,
    materialId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/projects/${projectId}/materials/${materialId}`,
      {
        withCredentials: true,
      }
    );
  }
}
