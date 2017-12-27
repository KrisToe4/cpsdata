import { Component, OnInit } from '@angular/core';

import { MenuService }       from '@services/menu.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() { }

  menuBtnClicked() {
    this.menuService.clickMenuBtn();
  }

}
