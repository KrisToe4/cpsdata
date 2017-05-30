import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewportComponent } from './map-viewport.component';

describe('MapViewportComponent', () => {
  let component: MapViewportComponent;
  let fixture: ComponentFixture<MapViewportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
