import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-summary',
  templateUrl: './summary.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './summary.component.css'
  ]
})
export class InspectionSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
