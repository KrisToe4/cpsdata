import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }   from '@angular/common';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AgmCoreModule,
         GoogleMapsAPIWrapper } from '@agm/core';

import { TechRoutingModule } from './tech.routing.module';

import { TechComponent } from './tech.component';

import { ControlsComponent } from './controls/controls.component';

import { InspectionComponent } from './inspection/inspection.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './tech.logout.component';
import { MenuComponent } from './menu/menu.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuardService } from '@guards/auth-guard.service';
import { LogoutResolverService } from '@resolvers/logout-resolver.service';
import { MenuResolverService } from '@resolvers/menu-resolver.service';

import { MapService } from '@services/map.service';
import { MenuService } from '@services/menu.service';
import { TechService } from '@services/tech.service';

@NgModule({
  declarations: [
    ControlsComponent,
    InspectionComponent,
    LoginComponent,
    LogoutComponent,
    MenuComponent,
    PasswordComponent,
    ProfileComponent,
    RegisterComponent,
    TechComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-86oRgcmLww9IEG_6fGD0yblWQFVQrPA' // This google API Key needs to be locked down in production in https://console.developers.google.com
    }),
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TechRoutingModule,
  ],
  providers: [
    AuthGuardService,
    LogoutResolverService,
    MenuResolverService,
    GoogleMapsAPIWrapper,
    MapService,
    MenuService,
    TechService 
  ]
})
export class TechModule {}