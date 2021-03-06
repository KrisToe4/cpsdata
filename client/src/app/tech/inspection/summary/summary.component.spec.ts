import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionSummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: InspectionSummaryComponent;
  let fixture: ComponentFixture<InspectionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
