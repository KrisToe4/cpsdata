import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@modules/material.module';

import { AgmCoreModule,
         MarkerManager } from '@agm/core';

import { LocalStorageModule } from 'angular-2-local-storage';

// App root Components
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { MenuComponent } from './menu/menu.component';
import { PageNotFoundComponent } from './not-found/not-found.component';

// Map Components

import { MapComponent } from './map/map.component';
import { MapControlsComponent } from './map/map-controls/map-controls.component';
import { MapTechListComponent } from './map/map-tech-list/map-tech-list.component';
import { MapViewportComponent } from './map/map-viewport/map-viewport.component';
import { MapMarkerDirective } from './map/map-viewport/map-marker.directive';

// Tech Components
import { TechModule } from './tech/tech.module';


@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    MenuComponent,
    MapComponent,
    MapControlsComponent,
    MapTechListComponent,
    MapViewportComponent,
    MapMarkerDirective,
    PageNotFoundComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-86oRgcmLww9IEG_6fGD0yblWQFVQrPA' // This google API Key needs to be locked down in production in https://console.developers.google.com
    }),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'cpsd',
      storageType: 'localStorage'
    }),
    TechModule,
    AppRoutingModule, // ** Must be imported last for routing to work properly!! ** //
  ],
  providers: [
    MarkerManager
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
