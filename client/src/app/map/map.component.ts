import { Component, 
         OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tech,
         TechList } from '../data-classes/tech';
import { TechService } from '@services/tech.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  techList: TechList = new TechList();
  selectedTech: Tech = new Tech();

  constructor(private route: ActivatedRoute,
              private techService: TechService) { }

  ngOnInit() {

    let component: MapComponent = this;

    this.techService.getTechList(this.route.snapshot.params['org'], function(error: string, list: TechList) {
      if (error) {
        // ** WIP: Error needs to be handled here ** //
        return;
      }

      component.techList = list;
    });

  }

  techSelectedFromList(tech: Tech) {

    this.selectedTech = tech;
  }

  techSelectedFromMap(tech: Tech) {

    this.selectedTech = tech;
  }
}
