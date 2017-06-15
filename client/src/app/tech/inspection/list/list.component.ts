import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,
         Router }            from '@angular/router';

import { MenuService }       from '@services/menu.service';

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



  constructor( private route: ActivatedRoute,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    let route = this.route;
    let router = this.router;

    this.menuService.watchForTrigger("create").subscribe(trigger => {

      if (trigger) {
        console.log("create");
        this.router.navigate(["create"], { relativeTo: route });
      }
    });

    this.menuService.watchForTrigger("edit").subscribe(trigger => {

      if (trigger) {
        console.log("edit");
        this.router.navigate(["general"], { relativeTo: route });
      }
    });
  }

}
