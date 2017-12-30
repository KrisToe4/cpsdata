import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,
         Router }            from '@angular/router';

import { MenuService }       from '@services/menu.service';

import { Inspection } from '@server-src/data-classes/inspection-model';
import { InspectionManager } from '@managers/inspection-manager';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class InspectionListComponent implements OnInit {

  selected: Inspection;
  list: Inspection[] = [];

  constructor( private route: ActivatedRoute,
               private inspectionManager: InspectionManager,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    let component: InspectionListComponent = this;
    let router = this.router;

    this.inspectionManager.watchList().subscribe((list: Inspection[]) => {
      component.list = list;
    });

    this.inspectionManager.watchActive().subscribe(inspection => {

      if ((component.selected == undefined) || (component.selected.id != inspection.id)) {
        component.selected = inspection;
        console.log(component.selected);
      }
    });

    this.menuService.watchForTrigger("new").subscribe(newRoute => {

      // newRoute should be blank here and if it is go to new
      if (newRoute) {
        
        this.router.navigate([newRoute], {relativeTo: this.route });
      }

    });

    this.menuService.watchForTrigger("edit").subscribe(newRoute => {

      if (newRoute && (component.selected.id > 0)) {
        this.router.navigate([newRoute]);
      }
    });
  }

  selectInspection(inspection: Inspection) {

    this.selected = inspection;
    this.inspectionManager.setActive(inspection.id);
  }

}
