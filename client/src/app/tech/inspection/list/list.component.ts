import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './list.component.css'
  ]
})
export class InspectionListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
