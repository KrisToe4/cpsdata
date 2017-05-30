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

  private techList: TechList = new TechList();
  private selectedTech: Tech = new Tech();

  constructor(private route: ActivatedRoute,
              private techService: TechService) { }

  ngOnInit() {

    let component: MapComponent = this;

    this.techService.getTechList(this.route.snapshot.params['org'], function(error: string, list: TechList) {
      if (error) {

      }

      component.techList = list;
    });

  }

  private techSelectedFromList(tech: Tech) {

    this.selectedTech = tech;
  }

  private techSelectedFromMap(tech: Tech) {

    this.selectedTech = tech;
  }
}
