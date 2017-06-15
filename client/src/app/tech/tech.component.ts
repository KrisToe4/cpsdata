import { Component,
         HostListener } from '@angular/core';

import { MenuService } from '@services/menu.service';

@Component({
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.css']
})
export class TechComponent {

  private hideMenu: boolean = false;

  constructor( private menuService: MenuService ) { 

    this.menuService.watchMenuVisibility().subscribe(visible => {
      this.hideMenu = !visible;
    });
  }

      /*
  * Adding even listener for resize window using the decorator HostListener
  * This will set the property innerWidth and decide wether or not we will
  * show the menu without button click
  */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.menuService.updateViewportWidth(event.target.innerWidth);
  }
}