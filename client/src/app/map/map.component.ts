import { Component, 
         OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tech,
         TechList } from '../data-classes/tech';
import { TechService } from '@services/tech.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  techList: TechList = new TechList();
  selectedTech: Tech = new Tech();

  constructor(private route: ActivatedRoute,
              private techService: TechService) { }

  ngOnInit() {

    let component: MapComponent = this;

    this.techService.getTechList(this.route.snapshot.params['org'], null, function(error: string, list: TechList) {
      if (error) {
        // ** WIP: Error needs to be handled here ** //
        return;
      }

      component.techList = list;

      if (component.selectedTech.id === 0) {
        list.techs.forEach(tech => {
          if (tech.id == component.route.snapshot.queryParams['tech']) {
            component.selectedTech = tech;
          }
        });
      }
    });

  }

  searchLocation(location: any)
  {
    let component: MapComponent = this;

    this.techService.getTechList(this.route.snapshot.params['org'], location, function(error: string, list: TechList) {
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
