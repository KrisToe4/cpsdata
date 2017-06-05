import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '@guards/auth-guard.service';
import { LogoutResolverService } from '@resolvers/logout-resolver.service';
import { MenuResolverService } from '@resolvers/menu-resolver.service';

import { TechComponent } from './tech.component';

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
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const techRoutes: Routes = [
  {
    path: 'tech',
    component: TechComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { 
        path: 'inspection',
        component: InspectionComponent,
        //canActivate: [AuthGuardService],
        children: [
          { path: '', component: InspectionListComponent },
          { path: 'create', component: InspectionCreateComponent },
          { path: 'arrival', component: InspectionArrivalComponent },
          { path: 'departure', component: InspectionDepartureComponent },
          { path: 'general', component: InspectionGeneralComponent },
          { path: 'restraint', component: InspectionRestraintComponent },
          { path: 'summary', component: InspectionSummaryComponent },
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
    //resolve: [MenuResolverService]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(techRoutes), CommonModule ],
  exports: [ RouterModule ]
})
export class TechRoutingModule { }
