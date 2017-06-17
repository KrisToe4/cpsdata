import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { Menu,
         MenuItem } from '@server-src/data-classes/menu-model';

import { TechService } from '@services/tech.service';

@Injectable()
export class MenuService {

  private static viewportWidth: number = 0;
  private static menuOpen: boolean = false;

  private static menuVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private static menuBtnVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 

  private static menuStack: Menu[];
  private static currentMenuSubject: BehaviorSubject<Menu> = new BehaviorSubject<Menu>(new Menu()); 

  private static actionTriggers: {};

  constructor(private techService: TechService) { 

    this.techService.getTechMenu().subscribe((menu: Menu) => { this.loadTechMenu(menu); });
  }  

  private loadTechMenu(menu: Menu) {

      MenuService.menuStack = [];
      MenuService.menuStack.push(menu);

      MenuService.actionTriggers = { "back": new Subject<string>() };

      // Push the latest version of the current menu (may be the same as before but that's ok)
      MenuService.currentMenuSubject.next(MenuService.menuStack[0]);
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

    let newRoute: string = "";
    if (menuItem.action == "back") { // Special Case

      // Store the current menu's relative root before popping it off
      // as we'll use it as a default route if one wasn't supplied
      newRoute = MenuService.menuStack[0].relativeTo;

      MenuService.menuStack.shift();
      MenuService.currentMenuSubject.next(MenuService.menuStack[0]); 

      // If they supplied a route, it is based off the new menu's relative root
      if (menuItem.route) {

        newRoute = MenuService.menuStack[0].relativeTo + menuItem.route;
      }
    }
    else {

      if (menuItem.subMenu) {

        MenuService.menuStack.unshift(menuItem.subMenu);
        MenuService.currentMenuSubject.next(MenuService.menuStack[0]);
      }

      newRoute = MenuService.menuStack[0].relativeTo;
      if (menuItem.route) {

        newRoute += menuItem.route;
      }
      else {
        
        newRoute = menuItem.action;
      }
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

  private update() {

    // Update the button visibility first
    let btnVisible: boolean = (MenuService.viewportWidth <= 768);
    MenuService.menuBtnVisibleSubject.next(btnVisible);

    // Then the menu itself
    let menuVisible: boolean = !btnVisible || MenuService.menuOpen;
    MenuService.menuVisibleSubject.next(menuVisible);
  }
}