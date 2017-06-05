import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-departure',
  templateUrl: './departure.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './departure.component.css'
  ]
})
export class InspectionDepartureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
