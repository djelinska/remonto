import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MaterialDto } from '../../../shared/models/material.dto';
import { MaterialFormDto } from './models/material-form.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMaterialsByProject(projectId: string): Observable<any[]> {
    return this.http.get<MaterialDto[]>(
      `${this.apiUrl}/projects/${projectId}/materials`
    );
  }

  getMaterialByProject(
    projectId: string,
    materialId: string
  ): Observable<any[]> {
    return this.http.get<MaterialDto[]>(
      `${this.apiUrl}/projects/${projectId}/materials/${materialId}`
    );
  }

  addMaterialToProject(
    projectId: string,
    material: MaterialFormDto
  ): Observable<MaterialDto> {
    return this.http.post<MaterialDto>(
      `${this.apiUrl}/projects/${projectId}/materials`,
      material
    );
  }

  updateMaterialInProject(
    projectId: string,
    materialId: string,
    material: MaterialFormDto
  ): Observable<MaterialDto> {
    return this.http.put<MaterialDto>(
      `${this.apiUrl}/projects/${projectId}/materials/${materialId}`,
      material
    );
  }

  deleteMaterialFromProject(
    projectId: string,
    materialId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/projects/${projectId}/materials/${materialId}`
    );
  }
}
