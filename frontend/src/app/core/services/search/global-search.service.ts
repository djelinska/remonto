import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SearchResultDto } from './models/search-result.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private apiUrl = environment.apiUrl;
  private allData: SearchResultDto[] = [];

  constructor(private http: HttpClient) {}

  fetchAllData(): Observable<{
    tasks: SearchResultDto[];
    materials: SearchResultDto[];
    tools: SearchResultDto[];
  }> {
    return this.http.get<{
      tasks: Array<{ _id: string, projectId: string, name: string, projectName: string }>;
      materials: Array<{ _id: string, projectId: string, name: string, projectName: string }>;
      tools: Array<{ _id: string, projectId: string, name: string, projectName: string }>;
    }>(`${this.apiUrl}/user/data`).pipe(
      map(data => ({
        tasks: data.tasks.map(t => ({
          id: t._id,
          projectId: t.projectId,
          name: t.name,
          projectName: t.projectName,
          type: 'task' as const
        })),
        materials: data.materials.map(m => ({
          id: m._id,
          projectId: m.projectId,
          name: m.name,
          projectName: m.projectName,
          type: 'material' as const
        })),
        tools: data.tools.map(t => ({
          id: t._id,
          projectId: t.projectId,
          name: t.name,
          projectName: t.projectName,
          type: 'tool' as const
        }))
      }))
    );
  }

  setAllData(data: {
    tasks: SearchResultDto[];
    materials: SearchResultDto[];
    tools: SearchResultDto[];
  }) {
    this.allData = [...data.tasks, ...data.materials, ...data.tools];
  }

  search(
    query: string,
    typeFilters: string[] = ['task', 'material', 'tool'],
    sortDirection: 'a-z' | 'z-a' = 'a-z'
  ): SearchResultDto[] {
    if (!query || query.length < 2) {
      return [];
    }
  
    const lowerQuery = query.toLowerCase();
  
    const filteredResults = this.allData.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(lowerQuery);
      const matchesType = typeFilters.includes(item.type);
      return matchesQuery && matchesType;
    });

    return [...filteredResults].sort((a, b) => {
      return sortDirection === 'a-z' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }
}