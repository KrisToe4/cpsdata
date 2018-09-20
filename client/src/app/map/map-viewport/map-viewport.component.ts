import { Component, 
         EventEmitter,
         Input,
         Output,
         NgZone, 
         OnInit,
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
  styleUrls: ['./map-viewport.component.scss']
})
export class MapViewportComponent implements OnInit {

  markerManager: MarkerManager;
  markerList = {};

  @Input() techList: TechList;
  @Input() selectedTech: Tech;
  @Output() techSelected = new EventEmitter<Tech>();
  @Output() searchLocation = new EventEmitter<any>();

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
        component.searchLocation.emit({geoLat: coordinates.lat, geoLng: coordinates.lng});
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

            techMarker.iconUrl = this.getIcon(change.currentValue);
            this.markerManager.updateIcon(techMarker);
            this.currentPosition = new MapSearchResult(change.currentValue.mapEntry.geoLat, 
                                                       change.currentValue.mapEntry.geoLng);
          }

          //Then update the previously selected tech
          if (change.previousValue) {
            techMarker = this.markerList[change.previousValue.profile.name];

            if (techMarker != undefined) {

              // This may eventually have different value depending on the tech
              techMarker.iconUrl = this.getIcon(change.currentValue);
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

  searchAddress(address: string) {

    let component = this;

    this.mapService.search(address, function(error: string, mapInfo: MapSearchResult) {

      // Make sure the map update by running in the correct zone
      component.zone.run(() => {

        // Update the map coordinates as well to reposition
        component.currentPosition = mapInfo;
        component.searchLocation.emit({geoLat: mapInfo.lat, geoLng: mapInfo.lng});
      });
    })
  }

  getIcon(tech: Tech) {
    if (this.selectedTech !== tech) {
      return 'assets/map/pale_blue.png';
    }
    else {
      return 'assets/map/red.png';
    }
  }

  selectTech(tech: Tech) {

    this.techSelected.emit(tech);
  }

}
