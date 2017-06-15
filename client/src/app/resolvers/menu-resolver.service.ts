import { Injectable }     from '@angular/core';
import { Router,
         Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LocalStorageModule } from 'angular-2-local-storage';

import { Menu } from '@server-src/data-classes/menu-model'
import { TechService } from '@services/tech.service';

@Injectable()
export class MenuResolverService implements Resolve<boolean> {

  constructor( private router: Router,
               private techService: TechService ) {  }

  resolve(): Promise<boolean> {
    return Promise.resolve(true).then(menuUpdated => true);
  }
}
