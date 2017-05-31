import { Component, 
         EventEmitter,
         Input,
         Output,
         NgZone, 
         OnInit,
         OnChanges,
         SimpleChanges } from '@angular/core';

import { AgmCoreModule, 
         AgmMarker,
         MarkerManager,
         GoogleMapsAPIWrapper } from '@agm/core';
import { MapMarkerDirective } from './map-marker.directive';

import { MapService } from '@services/map.service';
import { MapSearchResult } from '../../data-classes/map-api';

import { Tech,
         TechList } from '../../data-classes/tech';
import { TechProfile,
         TechMapEntry } from '@server-src/data-classes/tech-model';

@Component({
  selector: 'app-map-viewport',
  templateUrl: './map-viewport.component.html',
  styleUrls: ['./map-viewport.component.css']
})
export class MapViewportComponent implements OnInit {

  private markerManager: MarkerManager;
  private markerList = {};

  @Input() techList: TechList;
  @Input() selectedTech: Tech;
  @Output() techSelected = new EventEmitter<Tech>();

    // Map Values
  currentPosition: MapSearchResult = new MapSearchResult(0, 0);

  constructor( private mapService: MapService,
               private zone: NgZone) { }

  ngOnInit() {

    let component: MapViewportComponent = this;

    this.mapService.getCurrentLocation(function(error: string, coordinates: MapSearchResult) {

      if (error) {

        console.log("Map API: Error: " + error);
      }
      else {

        component.currentPosition = coordinates;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {

      let change = changes[propName];

      switch (propName) {
        case "techList": 

          // Not sure what to do here yet

          break;
        case "selectedTech":

          //Update the newly selected techs pin first
          let techMarker: AgmMarker = this.markerList[change.currentValue.profile.name];

          if (techMarker != undefined) {

            techMarker.iconUrl = 'assets/map/red.png';
            this.markerManager.updateIcon(techMarker);
          }

          //Then update the previously selected tech
          if (change.previousValue) {
            techMarker = this.markerList[change.previousValue.profile.name];

            if (techMarker != undefined) {

              // This may eventually have different value depending on the tech
              techMarker.iconUrl = 'assets/map/pale_blue.png';
              this.markerManager.updateIcon(techMarker);
            }
          }
          break;
      }

    }
  }

  setMarkerManager(markerManager: MarkerManager){
    this.markerManager = markerManager;
  }

  /**
   * Sets the markers, used by spidifier
   */
  setMarkers(markers: AgmMarker[]){

    markers.forEach(marker => {
      if (this.markerList[marker.title] == undefined) {
        this.markerList[marker.title] = marker;
      }
    });
  }

  private searchAddress(address: string) {

    let component = this;

    this.mapService.search(address, function(error: string, mapInfo: MapSearchResult) {

      // Make sure the map update by running in the correct zone
      component.zone.run(() => {

        // Update the map coordinates as well to reposition
        component.currentPosition = mapInfo;
      });
    })
  }

  private selectTech(tech: Tech) {

    this.techSelected.emit(tech);
  }

}