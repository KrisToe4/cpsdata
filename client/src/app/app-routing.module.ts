import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/tech/profile', pathMatch: 'full' },
  { path: 'map/:org',  component: MapComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes), CommonModule ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
