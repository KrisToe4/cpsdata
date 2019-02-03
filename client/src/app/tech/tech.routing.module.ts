import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '@guards/auth-guard.service';
import { WaiverGuardService } from '@guards/waiver-guard.service';

import { InspectionResolverService } from '@resolvers/inspection-resolver.service';
import { LogoutResolverService } from '@resolvers/logout-resolver.service';

import { TechComponent } from './tech.component';

import { InspectionComponent } from './inspection/inspection.component';
import { InspectionArrivalComponent } from './inspection/arrival/arrival.component';
import { InspectionNewComponent } from './inspection/new/new.component';
import { InspectionDepartureComponent } from './inspection/departure/departure.component';
import { InspectionGeneralComponent } from './inspection/general/general.component';
import { InspectionListComponent } from './inspection/list/list.component';
import { InspectionRestraintComponent } from './inspection/restraint/restraint.component';
import { InspectionSummaryComponent } from './inspection/summary/summary.component';
import { InspectionWaiverComponent } from './inspection/waiver/waiver.component';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './tech.logout.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

/*
const techRoutes: Routes = [
  {
    path: 'tech',
    component: TechComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { 
        path: 'inspection',
        component: InspectionComponent,
        canActivate: [AuthGuardService],
        resolve: [InspectionResolverService],
        runGuardsAndResolvers: 'always',
        children: [
          { path: '', component: InspectionListComponent },
          { 
            path: '',
            children: [
              { path: 'general', component: InspectionGeneralComponent, canActivate: [WaiverGuardService] },
              { path: 'arrival', component: InspectionArrivalComponent, canActivate: [WaiverGuardService] },
              { path: 'restraint', component: InspectionRestraintComponent, canActivate: [WaiverGuardService] },
              { path: 'departure', component: InspectionDepartureComponent, canActivate: [WaiverGuardService] },
              { path: 'summary', component: InspectionSummaryComponent, canActivate: [WaiverGuardService] },
              { path: 'waiver', component: InspectionWaiverComponent },
            ]
          },
          { path: 'new', component: InspectionNewComponent }
        ]
      },
      { path: 'login', component: LoginComponent },
      {
        path: 'logout',
        component: LogoutComponent,
        resolve: [ LogoutResolverService ]
      },
      { path: 'password/:token', component: PasswordComponent },
      { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [AuthGuardService],
      },
      { path: 'register/:token', component: RegisterComponent }
    ],
  }
];
*/
const techRoutes: Routes = [
  { path: '',   redirectTo: '/', pathMatch: 'prefix' }
];

@NgModule({
  imports: [ RouterModule.forChild(techRoutes), CommonModule ],
  exports: [ RouterModule ]
})
export class TechRoutingModule { }
