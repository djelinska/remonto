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

  fetchAllData(): Observable<{ tasks: SearchResultDto[]; materials: SearchResultDto[]; tools: SearchResultDto[] }> {
    return this.http.get<{ tasks: SearchResultDto[]; materials: SearchResultDto[]; tools: SearchResultDto[] }>(`${this.apiUrl}/user/data`);
  }

  setAllData(data: { tasks: SearchResultDto[]; materials: SearchResultDto[]; tools: SearchResultDto[] }) {
    this.allData = [...data.tasks, ...data.materials, ...data.tools];
    console.log('🔄 Pełna baza danych:', this.allData);
  }

  search(query: string, typeFilters: string[] = ['task', 'material', 'tool']): SearchResultDto[] {
    if (!query || query.length < 2) {
      return [];
    }
  
    const lowerQuery = query.toLowerCase();
    
    // Step 1: Apply filtering first
    let filteredResults = this.allData.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery) &&
      typeFilters.includes(item.type) // Ensure filtering based on selected types
    );
  
    console.log('🔍 Wyniki po filtracji:', filteredResults);
  
    // Step 2: Sort the results based on the desired order (task, material, tool)
    filteredResults = filteredResults.sort((a, b) => {
      const order = ['task', 'material', 'tool'];
      return order.indexOf(a.type) - order.indexOf(b.type);
    });
  
    console.log('🔍 Wyniki po posortowaniu:', filteredResults);
  
    return filteredResults;
  }
}
