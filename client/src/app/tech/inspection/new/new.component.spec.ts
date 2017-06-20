import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionNewComponent } from './new.component';

describe('NewInspectionComponent', () => {
  let component: InspectionNewComponent;
  let fixture: ComponentFixture<InspectionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
