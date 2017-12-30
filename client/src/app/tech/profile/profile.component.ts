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
         TechCertification,
         TechCertTypes } from '@server-src/data-classes/tech-model';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  certList = TechCertTypes;

  certValid: boolean = false;
  certVerificationMsg: string = "";

  form: FormGroup;
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

    this.form = this.formBuilder.group({
      profile: this.formBuilder.group({
        email: [""],
        name: [""],
        cert: this.formBuilder.group(new TechCertification())
      }),
      mapEntry: this.formBuilder.group(new TechMapEntry())
    });
  }

  private loadForm() {

    this.techService.getProfileObserver().subscribe((profileInfo: TechProfile) => {

      // Disable the map entry group if they don't have a valid certification
      if (profileInfo.cert.valid) {

        this.certValid = true;
      }
      else {
        
        this.certValid = false;
        if (profileInfo.cert.org == TechCertTypes.orgs[0]) {

          this.certVerificationMsg = "*Certification UNREGISTERED (required for adding a map entry)";
        }
        else {

          this.certVerificationMsg = "*Certification UNVERIFIED (required for adding a map entry).";
        }
        this.form.controls['mapEntry'].disable();
    }

      this.form.patchValue({
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

      this.form.patchValue({
        mapEntry: mapInfo
      });


      this.currentPosition.lat = mapInfo.geoLat;
      this.currentPosition.lng = mapInfo.geoLng;
    });

    this.form.valueChanges.subscribe((data) => {

      this.unsavedChanges = true;

      // Need to handle individual formcontrol state but its proving difficult....

      /*
      if (data.mapEntry.public == false) {

        //this.form.get('mapEntry.displayEmail').disable({emitEvent: false});
      }
      */

    });
  }


  // ** Event Handlers ** //
  searchAddress(address: string) {

    let profileComponent = this;

    this.mapService.search(address, function(error: string, mapInfo: MapSearchResult) {

      // Make sure the map update by running in the correct zone
      profileComponent.zone.run(() => {

        profileComponent.form.patchValue({
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

  invalidCert() {

    let invalidCert = true;


    return invalidCert;
  }

  saveBtnClicked() {

    let component = this;

    if (this.unsavedChanges) {

      // We'll eventually want some validation but for now don't bother
      this.techService.updateTechProfile(this.form.value, function(error: string) {
        if (error) {

        }
        else {
          alert("Profile Updated");
          component.unsavedChanges = false;
        }
      });
    }
  }

  revertBtnClicked() {

    // We should at some point give them a warning before resetting the form
    this.form.setValue(this.techService.getTechProfile());

    this.unsavedChanges = false;
  }
  // *************************** //
}