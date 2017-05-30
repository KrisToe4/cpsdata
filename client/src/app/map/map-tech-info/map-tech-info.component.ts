import { Component, Input, OnInit } from '@angular/core';

import { Tech } from '../../data-classes/tech';
import { TechProfile,
         TechMapEntry } from '@server-src/data-classes/tech-model';

@Component({
  selector: 'app-map-tech-info',
  templateUrl: './map-tech-info.component.html',
  styleUrls: ['./map-tech-info.component.css']
})
export class MapTechInfoComponent implements OnInit {

  private techDetails: TechMapEntry;

  @Input()
  set selectedTech(tech: Tech) {
    
    this.techDetails = tech.mapEntry;
  }

  constructor() { }

  ngOnInit() {
  }

}
