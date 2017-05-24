import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AgmCoreModule } from '@agm/core';
import { LocalStorageModule } from 'angular-2-local-storage';

// App root Components
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './not-found/not-found.component';

// Tech Components
import { TechModule } from './tech/tech.module';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    MapComponent,
    PageNotFoundComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-86oRgcmLww9IEG_6fGD0yblWQFVQrPA' // This google API Key needs to be locked down in production in https://console.developers.google.com
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'cpsd',
      storageType: 'localStorage'
    }),
    TechModule,
    AppRoutingModule, // ** Must be imported last for routing to work properly!! **
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
