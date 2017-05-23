import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@guards/auth-guard.service';
import { LogoutResolverService } from '@resolvers/logout-resolver.service';
import { MenuResolverService } from '@resolvers/menu-resolver.service';

import { TechComponent } from './tech.component';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './tech.logout.component';
import { InspectionComponent } from './inspection/inspection.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';

const techRoutes: Routes = [
  {
    path: 'tech',
    component: TechComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'inspection', component: InspectionComponent, canActivate: [AuthGuardService] },
      { path: 'password/:token', component: PasswordComponent },
      { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [AuthGuardService],
      },
      {
        path: 'logout',
        component: LogoutComponent,
        resolve: [ LogoutResolverService ]
      }
    ],
    //resolve: [MenuResolverService]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(techRoutes), CommonModule ],
  exports: [ RouterModule ]
})
export class TechRoutingModule { }
