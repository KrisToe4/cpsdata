import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }   from '@angular/common';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@modules/material.module';

import { AgmCoreModule,
         GoogleMapsAPIWrapper } from '@agm/core';

import { SidebarModule } from 'ng-sidebar';

import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureFieldComponent } from '@parts/signature-field/signature-field.component';

import { TechRoutingModule } from './tech.routing.module';

import { TechComponent } from './tech.component';

import { InspectionComponent } from './inspection/inspection.component';
import { InspectionArrivalComponent } from './inspection/arrival/arrival.component';
import { InspectionDepartureComponent } from './inspection/departure/departure.component';
import { InspectionGeneralComponent } from './inspection/general/general.component';
import { InspectionListComponent } from './inspection/list/list.component';
import { InspectionNewComponent } from './inspection/new/new.component';
import { InspectionRestraintComponent } from './inspection/restraint/restraint.component';
import { InspectionSummaryComponent } from './inspection/summary/summary.component';
import { InspectionWaiverComponent } from './inspection/waiver/waiver.component';

import { LoginComponent,
         LoginRegisterDialog } from './login/login.component';

import { LogoutComponent } from './tech.logout.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent,
         ProfileSaveDialog } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuardService } from '@guards/auth-guard.service';
import { WaiverGuardService } from '@guards/waiver-guard.service';

import { InspectionResolverService } from '@resolvers/inspection-resolver.service';
import { LogoutResolverService } from '@resolvers/logout-resolver.service';

import { InspectionManager } from '@managers/inspection-manager';

import { InspectionService } from '@services/inspection.service';
import { MapService } from '@services/map.service';
import { MenuService } from '@services/menu.service';
import { TechService } from '@services/tech.service';

@NgModule({
  declarations: [
    InspectionComponent,
    InspectionArrivalComponent,
    InspectionNewComponent,
    InspectionDepartureComponent,
    InspectionGeneralComponent,
    InspectionListComponent,
    InspectionRestraintComponent,
    InspectionSummaryComponent,
    InspectionWaiverComponent,
    LoginComponent,
    LoginRegisterDialog,
    LogoutComponent,
    PasswordComponent,
    ProfileComponent,
    ProfileSaveDialog,
    RegisterComponent,
    SignatureFieldComponent,
    TechComponent,
  ],
  entryComponents: [
    LoginRegisterDialog,
    ProfileSaveDialog
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-86oRgcmLww9IEG_6fGD0yblWQFVQrPA' // This google API Key needs to be locked down in production in https://console.developers.google.com
    }),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule.forRoot(),
    SignaturePadModule,
    TechRoutingModule
  ],
  providers: [
    AuthGuardService,
    InspectionResolverService,
    LogoutResolverService,
    GoogleMapsAPIWrapper,
    InspectionManager,
    InspectionService,
    MapService,
    MenuService,
    TechService,
    WaiverGuardService
  ]
})
export class TechModule {}