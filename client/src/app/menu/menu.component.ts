import { Component,
         OnInit }            from '@angular/core';

import { ActivatedRoute,
         Router,
         NavigationEnd }            from '@angular/router';

import { Menu, 
         MenuItem }        from '@server-src/data-classes/menu-model';
import { MenuService }       from '@services/menu.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.css' ]
})
export class MenuComponent implements OnInit {

  activeMenu: Menu;

  currentRoute: string = "";

  constructor( private route: ActivatedRoute,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    this.currentRoute = this.router.url;
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });

    this.menuService.watchCurrentMenu().subscribe(currentMenu => {
      this.activeMenu = currentMenu;
    });

    this.menuService.watchForTrigger("back").subscribe(route => {
      this.router.navigate([route]);
    });
  }

  

  onClick(menuItem: MenuItem) {
 
    if (menuItem.action) {

      this.menuService.updateTrigger(menuItem);
    }
    else if (menuItem.route) {

      this.router.navigate([this.activeMenu.relativeTo + menuItem.route]);
    }

    return false;
  }

}
