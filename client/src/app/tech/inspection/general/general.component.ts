import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-general',
  templateUrl: './general.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './general.component.css'
  ]
})
export class InspectionGeneralComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
