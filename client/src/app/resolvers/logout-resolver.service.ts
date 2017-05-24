import { Injectable }     from '@angular/core';
import { Router,
         Resolve } from '@angular/router';

import { LocalStorageModule } from 'angular-2-local-storage';

import { TechService } from '@services/tech.service';


@Injectable()
export class LogoutResolverService implements Resolve<boolean> {

  constructor( private router: Router,
               private techService: TechService ) {  }

  resolve(): Promise<boolean> {
    return this.techService.logout().then(logoutSucceeded => {

      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");

      this.router.navigate(['/tech/login']);
      return null;
    });

  }
}