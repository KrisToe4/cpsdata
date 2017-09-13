import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { NavigationEnd,
         Router } from '@angular/router';

import { MenuTree,
         Menu,
         MenuItem } from '@server-src/data-classes/menu-model';

import { TechService } from '@services/tech.service';

@Injectable()
export class MenuService {

  private static viewportWidth: number = 0;
  private static menuOpen: boolean = false;

  private static menuVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private static menuBtnVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 


  private static menuTree: MenuTree;
  private static currentMenu: Menu;
  private static currentMenuSubject: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(new Menu()); 

  private static actionTriggers: {};

  public static getCurrentMenu(): Menu {

    return MenuService.currentMenu;
  }

  constructor( private router: Router,
               private techService: TechService ) { 

    this.techService.getTechMenuTree().subscribe((menuTree: MenuTree) => { this.loadMenuTree(menuTree); });
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        //console.log("Router Event: " + event);
        this.updateMenu(event.url).then(result => {

          if (result) {
            console.log("Menu updated");
          }
          else {
            console.log("Menu current");
          }
        });
      }
    });

  }  

  private loadMenuTree(tree: MenuTree) {

      MenuService.menuTree = tree;
      MenuService.currentMenu = tree.getMenu(0);

      MenuService.actionTriggers = { "back": new Subject<string>() };

      // Push the main menu
      MenuService.currentMenuSubject.next(MenuService.getCurrentMenu());
  }

  private updateMenu(url: string): Promise<boolean> {
    
    return new Promise(resolve => {

      let menu: Menu = MenuService.menuTree.search(url);

      if (MenuService.currentMenu.getRoute() == menu.getRoute()) {
        resolve(false);
        return;
      }

      MenuService.currentMenu = menu;
      MenuService.currentMenuSubject.next(menu);
      resolve(true);
    });
  }

  private update() {

    // Update the button visibility first
    let btnVisible: boolean = (MenuService.viewportWidth <= 768);
    MenuService.menuBtnVisibleSubject.next(btnVisible);

    // Then the menu itself
    let menuVisible: boolean = !btnVisible || MenuService.menuOpen;
    MenuService.menuVisibleSubject.next(menuVisible);
  }

  public watchCurrentMenu(): Observable<Menu> {

    return MenuService.currentMenuSubject.asObservable();
  }

  public watchMenuVisibility(): Observable<boolean> {

    return MenuService.menuVisibleSubject.asObservable();
  }

  public watchMenuBtnVisibility(): Observable<boolean> {

    return MenuService.menuBtnVisibleSubject.asObservable();
  }

  public watchForTrigger(trigger: string): Observable<string> {

    if (MenuService.actionTriggers[trigger] == undefined) {

      MenuService.actionTriggers[trigger] = new Subject<string>();
    }

      return MenuService.actionTriggers[trigger].asObservable();
  }

  public updateTrigger(menuItem: MenuItem) {

    if (menuItem.action == undefined) { return; }

    if (MenuService.actionTriggers[menuItem.action] == undefined) {

      MenuService.actionTriggers[menuItem.action] = new Subject<string>();
    }

    let menu: Menu = MenuService.getCurrentMenu();

    let newRoute: string;
    if ((menuItem.action == "back") || 
        (menuItem.route == "*")) { // Back action or action with * route 
                                   // are special cases

      newRoute = menu.relativeTo;
    }
    else {

      newRoute = menu.getRoute() + menuItem.route;
    }

    MenuService.actionTriggers[menuItem.action].next(newRoute);
  }

  public updateViewportWidth(width: number) {

    MenuService.viewportWidth = width;
    this.update();
  }

  public clickMenuBtn() {

    MenuService.menuOpen = !MenuService.menuOpen;
    this.update();
  }
}