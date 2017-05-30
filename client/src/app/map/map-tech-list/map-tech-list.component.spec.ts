import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTechPanelComponent } from './map-tech-panel.component';

describe('MapTechPanelComponent', () => {
  let component: MapTechPanelComponent;
  let fixture: ComponentFixture<MapTechPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTechPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTechPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
