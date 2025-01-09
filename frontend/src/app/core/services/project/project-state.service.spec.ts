import { TestBed } from '@angular/core/testing';

import { ProjectStateService } from './project-state.service';

describe('ProjectStateService', () => {
  let service: ProjectStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
