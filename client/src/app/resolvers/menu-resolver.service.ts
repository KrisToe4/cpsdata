import { Injectable }     from '@angular/core';
import { Router,
         Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LocalStorageModule } from 'angular-2-local-storage';

import { Action } from '@server-src/data-classes/action'
import { TechService } from '@services/tech.service';


@Injectable()
export class MenuResolverService /*implements Observable<Action[]>*/ {

  constructor( private router: Router,
               private techService: TechService ) {  }
  
}
