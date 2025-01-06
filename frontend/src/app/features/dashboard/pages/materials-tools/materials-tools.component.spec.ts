import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsToolsComponent } from './materials-tools.component';

describe('MaterialsToolsComponent', () => {
  let component: MaterialsToolsComponent;
  let fixture: ComponentFixture<MaterialsToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsToolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialsToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
