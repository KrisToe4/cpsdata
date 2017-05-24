import { Injectable, NgZone } from '@angular/core';

import { AgmCoreModule,
         MapsAPILoader } from '@agm/core';

import { Observable, Observer } from 'rxjs';

import { MapSearchResult } from '../data-classes/map-api';

declare var google: any;

@Injectable()
export class MapService { 

    private apiLoaded: boolean = false;

    constructor(private apiLoader: MapsAPILoader) {

        console.log("Loading Map API");

        this.apiReady().then(() => {

            console.log("Map API ready");
        });
    }

    private apiReady() {
        if (this.apiLoaded) {
            return Promise.resolve();
        }

        return this.apiLoader.load().then(() => { 
            
            this.apiLoaded = true; 
            return Promise.resolve();
        });
    }

    search(address: string, callback: (err: any, mapInfo?: MapSearchResult) => void) {
        
        this.apiReady().then(() => {

            let geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': address}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    console.log(results);

                    let searchResult: MapSearchResult = new MapSearchResult(Number(results[0].geometry.location.lat().toFixed(4)),
                                                                            Number(results[0].geometry.location.lng().toFixed(4)),
                                                                            results[0].formatted_address);
                    // Loop through the address components to get the rest
                    results[0].address_components.forEach(component => {

                        switch (component.types[0]) {
                            
                            case "postal_code":
                                searchResult.postalCode = component.short_name;
                                break;
                            case "locality":
                                searchResult.city = component.short_name;
                                break;
                            case "administrative_area_level_1":
                                searchResult.province = component.short_name;
                                break;
                            case "administrative_area_level_2":
                                searchResult.region = component.short_name;
                                break;
                        }
                    });


                    callback(null, searchResult);
                } 
                else {

                    callback(results);
                }
            });
             
        });
    }

    getCurrentLocation(callback: (err: any, coordinates?: MapSearchResult) => void) {
        let service: MapService = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

                service.apiReady().then(() => {

                    let latlng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    let geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'latLng' : latlng }, function (results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {

                            console.log(results);

                            let searchResult: MapSearchResult = new MapSearchResult(latlng.lat, latlng.lng, results[0].formatted_address);

                            // Loop through the address components to get the rest
                            results[0].address_components.forEach(component => {

                                switch (component.types[0]) {

                                    case "postal_code":
                                        searchResult.postalCode = component.short_name;
                                        break;
                                    case "locality":
                                        searchResult.city = component.short_name;
                                        break;
                                    case "administrative_area_level_1":
                                        searchResult.province = component.short_name;
                                        break;
                                    case "administrative_area_level_2":
                                        searchResult.region = component.short_name;
                                        break;
                                }
                            });


                            callback(null, searchResult);
                        }
                        else {

                            callback(results);
                        }
                    });
                });
            });
        }
        else {

            callback("Geolocation not available.");
        }
    }
}