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
  searchControl = new FormControl({ value: '', disabled: true });
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
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          this.results = this.searchService.search(query);
        }
      });
  }

  getResultLink(result: SearchResultDto): string {
    return result.type === 'task'
      ? `/dashboard/projects/${result.projectId}/tasks`
      : `/dashboard/projects/${result.projectId}/materials-tools`;
  }
}
