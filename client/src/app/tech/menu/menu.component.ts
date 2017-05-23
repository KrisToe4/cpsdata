import { Component,
         OnInit }            from '@angular/core';
import { Router }            from '@angular/router';

import { Action, 
         ActionList }        from '@server-src/data-classes/action'
import { Tech }              from '../../data-classes/tech';

import { MenuService }       from '@services/menu.service';
import { TechService }       from '@services/tech.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.css' ]
})
export class MenuComponent implements OnInit {

  public actions: ActionList;

  private showMenuBtn: boolean = false;

  constructor( private menuService: MenuService,
               private techService: TechService,
               private router: Router ) { }

  ngOnInit() {

    this.menuService.getMenuBtnObserver().subscribe(showBtn => {
      this.showMenuBtn = showBtn;
    });

    // **ksw** We should probably let the menu service handle this but leave for now
    this.techService.getAuthorizedActions().subscribe(list => {
      this.actions = list;
    });
  }

  menuBtnClicked() {
    this.menuService.clickMenuBtn();
  }

}
