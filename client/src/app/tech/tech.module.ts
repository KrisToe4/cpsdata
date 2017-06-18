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
import { InspectionArrivalComponent } from './inspection/arrival/arrival.component';
import { InspectionCreateComponent } from './inspection/create/create.component';
import { InspectionDepartureComponent } from './inspection/departure/departure.component';
import { InspectionGeneralComponent } from './inspection/general/general.component';
import { InspectionListComponent } from './inspection/list/list.component';
import { InspectionRestraintComponent } from './inspection/restraint/restraint.component';
import { InspectionSummaryComponent } from './inspection/summary/summary.component';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './tech.logout.component';
import { MenuComponent } from './menu/menu.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuardService } from '@guards/auth-guard.service';

import { InspectionResolverService } from '@resolvers/inspection-resolver.service';
import { LogoutResolverService } from '@resolvers/logout-resolver.service';

import { InspectionService } from '@services/inspection.service';
import { MapService } from '@services/map.service';
import { MenuService } from '@services/menu.service';
import { TechService } from '@services/tech.service';

@NgModule({
  declarations: [
    ControlsComponent,
    InspectionComponent,
    InspectionArrivalComponent,
    InspectionCreateComponent,
    InspectionDepartureComponent,
    InspectionGeneralComponent,
    InspectionListComponent,
    InspectionRestraintComponent,
    InspectionSummaryComponent,
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
    TechRoutingModule
  ],
  providers: [
    AuthGuardService,
    InspectionResolverService,
    LogoutResolverService,
    GoogleMapsAPIWrapper,
    InspectionService,
    MapService,
    MenuService,
    TechService 
  ]
})
export class TechModule {}