import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionWaiverComponent } from './waiver.component';

describe('SummaryComponent', () => {
  let component: InspectionWaiverComponent;
  let fixture: ComponentFixture<InspectionWaiverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionWaiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionWaiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
