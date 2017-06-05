import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-restraint',
  templateUrl: './restraint.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './restraint.component.css'
  ]
})
export class InspectionRestraintComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
