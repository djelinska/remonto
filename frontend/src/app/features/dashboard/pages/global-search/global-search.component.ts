import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { GlobalSearchService } from '../../../../core/services/search/global-search.service';
import { HighlightTypeDirective } from '../../../../shared/directives/highlight-type.directive';
import { RouterLink } from '@angular/router';
import { SearchResultDto } from '../../../../core/services/search/models/search-result.dto';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [ReactiveFormsModule, HighlightTypeDirective, RouterLink],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
})
export class GlobalSearchComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  searchControl = new FormControl('');
  filterControl = new FormControl<string[]>(['task', 'material', 'tool']); 
  
  results: SearchResultDto[] = [];
  isLoading = true;

  constructor(private searchService: GlobalSearchService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 300);
  }

  ngOnInit(): void {
    this.searchService.fetchAllData().subscribe((data) => {
      this.searchService.setAllData(data);
      this.searchControl.enable();
      this.performSearch(); 
    });
  
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.performSearch());
  
    this.filterControl.valueChanges.subscribe(() => this.performSearch());
  }

  performSearch(): void {
    const query = this.searchControl.value || '';
    const selectedFilters = [...(this.filterControl.value ?? ['task', 'material', 'tool'])];
  
    // Log selected filters before performing the search
    console.log('📌 Aktualne filtry:', selectedFilters);
  
    this.results = this.searchService.search(query, selectedFilters);
  
    // Debugging logs to track the process
    console.log('🔍 Aktualna fraza:', query);
    console.log('📋 Wyniki wyszukiwania:', this.results);
  }
  

  getResultLink(result: SearchResultDto): string {
    return result.type === 'task'
      ? `/dashboard/projects/${result.projectId}/tasks`
      : `/dashboard/projects/${result.projectId}/materials-tools`;
  }

  toggleFilter(type: string): void {
    // Use Set to avoid duplicates
    const filters = new Set(this.filterControl.value);
  
    // Add/remove filters correctly
    if (filters.has(type)) {
      filters.delete(type);
    } else {
      filters.add(type);
    }
  
    // Set the updated filters
    this.filterControl.setValue(Array.from(filters));
  
    // Debugging logs to track changes
    console.log('✅ Po zmianie filtrów:', this.filterControl.value);
  }
  
  
}
