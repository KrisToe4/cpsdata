import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestraintComponent } from './restraint.component';

describe('RestraintComponent', () => {
  let component: RestraintComponent;
  let fixture: ComponentFixture<RestraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestraintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
