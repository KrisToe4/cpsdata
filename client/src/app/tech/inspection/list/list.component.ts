import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,
         Router }            from '@angular/router';

import { MenuService }       from '@services/menu.service';

import { Inspection } from '@server-src/data-classes/inspection-model';

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

  private list: Inspection[] = [];

  constructor( private route: ActivatedRoute,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    let component: InspectionListComponent = this;
    let router = this.router;

    this.route.data.subscribe(data => {

      console.log(data);

      component.list = data[0];

      console.log(component.list);
    });

    this.menuService.watchForTrigger("create").subscribe(newRoute => {

      // newRoute should be blank here and if it is go to create
      if (newRoute) {
        this.router.navigate([newRoute], {relativeTo: this.route });
      }

    });

    this.menuService.watchForTrigger("edit").subscribe(newRoute => {

      if (newRoute) {
        this.router.navigate([newRoute]);
      }
    });
  }

}
