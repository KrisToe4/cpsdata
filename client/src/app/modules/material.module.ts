import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatIconModule, 
        MatLineModule,
        MatListModule,
        MatToolbarModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatToolbarModule, 
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatToolbarModule, 
  ],
})
export class MaterialModule { }
