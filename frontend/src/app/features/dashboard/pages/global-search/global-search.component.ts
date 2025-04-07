import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, merge } from 'rxjs';

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
  sortDirectionControl = new FormControl<'a-z' | 'z-a'>('a-z');

  results: SearchResultDto[] = [];
  isLoading = true;

  constructor(private searchService: GlobalSearchService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 300);
  }

  ngOnInit(): void {
    this.searchService.fetchAllData().subscribe({
      next: (data) => {
        this.searchService.setAllData(data);
        this.searchControl.enable();
        this.performSearch();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
      }
    });

    merge(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
      this.filterControl.valueChanges,
      this.sortDirectionControl.valueChanges
    ).subscribe(() => this.performSearch());
  }

  performSearch(): void {
    const query = this.searchControl.value || '';
    const selectedFilters = this.filterControl.value || ['task', 'material', 'tool'];
    const sortDirection = this.sortDirectionControl.value || 'a-z';
    
    this.results = this.searchService.search(query, selectedFilters, sortDirection);
  }

  getResultLink(result: SearchResultDto): string {
    return result.type === 'task'
      ? `/dashboard/projects/${result.projectId}/tasks/${result.id}`
      : `/dashboard/projects/${result.projectId}/materials-tools/${result.id}`;
  }

  toggleFilter(type: string): void {
    const currentFilters = this.filterControl.value || [];
    const newFilters = currentFilters.includes(type)
      ? currentFilters.filter(t => t !== type)
      : [...currentFilters, type];

    this.filterControl.setValue(newFilters);
  }

  trackByResult(index: number, result: SearchResultDto): string {
    return result.id;
  }
}