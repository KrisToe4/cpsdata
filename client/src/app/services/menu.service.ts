import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class MenuService {

  private static viewportWidth: number = 0;
  private static menuOpen: boolean = false;

  private static menuVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private static menuBtnVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 

  constructor() { }  

  private update() {

    // Update the button visibility first
    let btnVisible: boolean = (MenuService.viewportWidth <= 768);
    MenuService.menuBtnVisibleSubject.next(btnVisible);

    // Then the menu itself
    let menuVisible: boolean = !btnVisible || MenuService.menuOpen;
    MenuService.menuVisibleSubject.next(menuVisible);
   
  }

  public getMenuObserver(): Observable<boolean> {

    return MenuService.menuVisibleSubject.asObservable();
  }

  public getMenuBtnObserver(): Observable<boolean> {

    return MenuService.menuBtnVisibleSubject.asObservable();
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