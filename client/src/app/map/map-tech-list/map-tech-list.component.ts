import { Component, 
         EventEmitter,
         Input, 
         Output,
         OnInit } from '@angular/core';

import { Tech,
         TechList } from '../../data-classes/tech';
import { TechProfile,
         TechMapEntry } from '@server-src/data-classes/tech-model';

@Component({
  selector: 'app-map-tech-list',
  templateUrl: './map-tech-list.component.html',
  styleUrls: ['./map-tech-list.component.css']
})
export class MapTechListComponent implements OnInit {

  private sortOptions = ['Name', 'Distance'];

  @Input() techList: TechList;
  @Input() selectedTech: Tech;

  @Output() techSelected = new EventEmitter<Tech>();

  constructor() { }

  ngOnInit() {
  }

  selectTech(tech: Tech) {

    this.techSelected.emit(tech);
  }
}
