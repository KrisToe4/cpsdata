import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,
         Router }            from '@angular/router';

import { MenuService }       from '@services/menu.service';

import { Inspection } from '@server-src/data-classes/inspection-model';
import { InspectionService } from '@services/inspection.service';

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
               private inspectionService: InspectionService,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    let component: InspectionListComponent = this;
    let router = this.router;

    this.inspectionService.watchList().subscribe(list => {
      component.list = list;
    });

    this.menuService.watchForTrigger("new").subscribe(newRoute => {

      // newRoute should be blank here and if it is go to new
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
