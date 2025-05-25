import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TemplateDto } from '../../../shared/models/template.dto';
import { TemplateFormDto } from './models/template-form.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTemplates(): Observable<TemplateDto[]> {
    return this.http.get<TemplateDto[]>(`${this.apiUrl}/templates`);
  }

  getTemplateById(id: string): Observable<TemplateDto> {
    return this.http.get<TemplateDto>(`${this.apiUrl}/admin/templates/${id}`);
  }

  createTemplate(template: TemplateFormDto): Observable<TemplateDto> {
    return this.http.post<TemplateDto>(
      `${this.apiUrl}/admin/templates`,
      template
    );
  }

  updateTemplate(
    id: string,
    template: TemplateFormDto
  ): Observable<TemplateDto> {
    return this.http.patch<TemplateDto>(
      `${this.apiUrl}/admin/templates/${id}`,
      template
    );
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/templates/${id}`);
  }
}
