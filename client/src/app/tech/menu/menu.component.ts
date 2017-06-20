import { Component,
         OnInit }            from '@angular/core';

import { ActivatedRoute,
         Router,
         NavigationStart }            from '@angular/router';

import { Menu, 
         MenuItem }        from '@server-src/data-classes/menu-model'
import { Tech }              from '../../data-classes/tech';

import { MenuService }       from '@services/menu.service';
import { TechService }       from '@services/tech.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.css' ]
})
export class MenuComponent implements OnInit {

  public menu: Menu;

  private currentRoute: string = "";
  private showMenuBtn: boolean = false;

  constructor( private route: ActivatedRoute,
               private menuService: MenuService,
               private techService: TechService,
               private router: Router ) { }

  ngOnInit() {

    this.currentRoute = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(event);
        this.currentRoute = event.url;
      }
    });

    this.menuService.watchMenuBtnVisibility().subscribe(showBtn => {
      this.showMenuBtn = showBtn;
    });

    this.menuService.watchCurrentMenu().subscribe(techMenu => {
      this.menu = techMenu;
    });

    this.menuService.watchForTrigger("back").subscribe(route => {
      this.router.navigate([route]);
    });
  }

  menuBtnClicked() {
    this.menuService.clickMenuBtn();
  }

  onClick(menuItem: MenuItem) {
 
    if (menuItem.action) {

      this.menuService.updateTrigger(menuItem);
    }
    else if (menuItem.route) {

      this.router.navigate([this.menu.relativeTo + menuItem.route]);
    }

    return false;
  }

}
