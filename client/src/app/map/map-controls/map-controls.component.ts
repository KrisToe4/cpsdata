import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.css']
})
export class MapControlsComponent implements OnInit {

  certTypes = ['All', 'Instructor'];
  radiusOptions = ['25km', '50km', '100km', 'Full'];

  constructor() { }

  ngOnInit() {
  }

}
