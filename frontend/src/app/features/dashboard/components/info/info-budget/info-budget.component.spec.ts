import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBudgetComponent } from './info-budget.component';

describe('InfoBudgetComponent', () => {
  let component: InfoBudgetComponent;
  let fixture: ComponentFixture<InfoBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBudgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
