import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTechInfoComponent } from './map-tech-info.component';

describe('MapTechInfoComponent', () => {
  let component: MapTechInfoComponent;
  let fixture: ComponentFixture<MapTechInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTechInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTechInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
