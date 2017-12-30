import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatIconModule, 
        MatLineModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule, 
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule, 
  ],
})
export class MaterialModule { }
