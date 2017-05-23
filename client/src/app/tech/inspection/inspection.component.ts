import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './inspection.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../tech.view.css',
    './inspection.component.css'
  ]
})
export class InspectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
