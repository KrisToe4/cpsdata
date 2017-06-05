import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './arrival.component.css'
  ]
})
export class InspectionArrivalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
