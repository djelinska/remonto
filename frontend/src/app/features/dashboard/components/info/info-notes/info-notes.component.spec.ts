import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoNotesComponent } from './info-notes.component';

describe('InfoNotesComponent', () => {
  let component: InfoNotesComponent;
  let fixture: ComponentFixture<InfoNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
