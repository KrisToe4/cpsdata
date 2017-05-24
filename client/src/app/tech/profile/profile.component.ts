import { Component, 
         NgZone,
         OnInit } from '@angular/core';

import { FormBuilder,
         FormControl,
         FormGroup,
         ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule, 
         GoogleMapsAPIWrapper } from '@agm/core';
import { MapService } from '@services/map.service';
import { MapSearchResult } from '../../data-classes/map-api';

import { TechService } from '@services/tech.service';
import { TechProfile,
         TechMapEntry,
         TechCertifications } from '@server-src/data-classes/tech-model';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../tech.view.css',
    './profile.component.css'
  ]
})

export class ProfileComponent implements OnInit {

  certList = TechCertifications;

  profileForm: FormGroup;
  unsavedChanges: boolean = false;

  // Map Values
  currentPosition: MapSearchResult = new MapSearchResult(0, 0);

  constructor( private formBuilder: FormBuilder,
               private mapService: MapService,
               private techService: TechService,
               private zone: NgZone) { }

  ngOnInit() {

    this.buildForm();

    let component: ProfileComponent = this;

    this.mapService.getCurrentLocation(function(error: string, coordinates: MapSearchResult) {

      if (error) {

        console.log("Map API: Error: " + error);
      }
      else {

        component.currentPosition = coordinates;
      }
    
      component.loadForm();
    });
  }

  private buildForm() {

    this.profileForm = this.formBuilder.group({
      profile: this.formBuilder.group(new TechProfile()),
      mapEntry: this.formBuilder.group(new TechMapEntry())
    });
  }

  private loadForm() {

    this.techService.getProfileObserver().subscribe((profileInfo: TechProfile) => {

      // Set up default values
      if (profileInfo.certOrg == null) {

        profileInfo.certOrg = TechCertifications.orgs[0];
        profileInfo.certType = TechCertifications.types[0];
        profileInfo.certDate = new Date().toISOString().substring(0, 10);
      }

      this.profileForm.patchValue({
        profile: profileInfo
      });

    });

    this.techService.getMapEntryObserver().subscribe((mapInfo: TechMapEntry) => {

      // Set up default values
      if (mapInfo.geoLat == 0) {

        mapInfo.address = this.currentPosition.address;
        mapInfo.region = this.currentPosition.region;
        mapInfo.postalCode = this.currentPosition.postalCode;
        mapInfo.geoLat = this.currentPosition.lat;
        mapInfo.geoLng = this.currentPosition.lng;
      }

      this.profileForm.patchValue({
        mapEntry: mapInfo
      });


      this.currentPosition.lat = mapInfo.geoLat;
      this.currentPosition.lng = mapInfo.geoLng;
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChanges = true;
    });
  }


  // ** Event Handlers ** //
  private searchAddress(address: string) {

    let profileComponent = this;

    this.mapService.search(address, function(error: string, mapInfo: MapSearchResult) {

      // Make sure the map update by running in the correct zone
      profileComponent.zone.run(() => {

        profileComponent.profileForm.patchValue({
          mapEntry: {
            address: mapInfo.address,
            region: mapInfo.region,
            postalCode: mapInfo.postalCode,
            geoLat: mapInfo.lat,
            geoLng: mapInfo.lng,
        }})

        // Update the map coordinates as well to reposition
        profileComponent.currentPosition = mapInfo;
      });
    })
  }

  private saveBtnClicked() {

    let component = this;

    if (this.unsavedChanges) {

      // We'll eventually want some validation but for now don't bother
      this.techService.updateTechProfile(this.profileForm.value, function(error: string) {
        if (error) {

        }
        else {
          alert("Profile Updated");
          component.unsavedChanges = false;
        }
      });
    }
  }

  private revertBtnClicked() {

    // We should at some point give them a warning before resetting the form
    this.profileForm.setValue(this.techService.getTechProfile());

    this.unsavedChanges = false;
  }
  // *************************** //
}