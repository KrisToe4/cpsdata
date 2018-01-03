import { Component, 
         EventEmitter,
         Input,
         Output,
         OnInit,
         OnChanges,
         SimpleChanges } from '@angular/core';

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

  sortOptions = ['Name', 'Distance'];

  @Input() techList: TechList;
  @Input() selectedTech: Tech;
  @Output() techSelected = new EventEmitter<Tech>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {

      let change = changes[propName];

      switch (propName) {
        case "techList": 

          // Not sure what to do here yet

          break;
        case "selectedTech":

          break;
      }
    }
  }

  selectTech(tech: Tech) {

    this.techSelected.emit(tech);
  }
}
