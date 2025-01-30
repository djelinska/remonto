import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      tasks: SearchResultDto[];
      materials: SearchResultDto[];
      tools: SearchResultDto[];
    }>(`${this.apiUrl}/user/data`);
  }

  setAllData(data: {
    tasks: SearchResultDto[];
    materials: SearchResultDto[];
    tools: SearchResultDto[];
  }) {
    this.allData = [...data.tasks, ...data.materials, ...data.tools];
  }

  search(query: string): SearchResultDto[] {
    if (!query || query.length < 2) {
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return this.allData.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  }
}
