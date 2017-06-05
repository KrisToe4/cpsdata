import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspection-create',
  templateUrl: './create.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './create.component.css'
  ]
})
export class InspectionCreateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
