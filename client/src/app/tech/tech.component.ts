import { Component,
         HostListener } from '@angular/core';

import { MenuService } from '@services/menu.service';

@Component({
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.css']
})
export class TechComponent {

  private _opened: boolean = true;
  private _mode: string = "push";
  private _dock: boolean = false;
  private _autoCollapseWidth: number = 768;

  hideMenu: boolean = false;
  
  constructor( private menuService: MenuService ) { 

    this.menuService.watchMenuVisibility().subscribe(visible => {
      this._opened = visible;
    });
  }
}