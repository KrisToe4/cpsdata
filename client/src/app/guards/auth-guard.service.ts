import { Injectable }     from '@angular/core';
import { Router,
         CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot, } from '@angular/router';

import { LocalStorageModule } from 'angular-2-local-storage';

import { TechService } from '@services/tech.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor ( private techService: TechService,
                private localStorage: LocalStorageModule,
                private router: Router ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    let router: Router = this.router;
    this.techService.requestedUrl = state.url;

    // Check our current session
    if (this.techService.techAuthorized())  {
      return true;
    }

    // Look for both session and a locally stored token ("remember me")
    let storedToken = sessionStorage.getItem("auth");
    if (storedToken == undefined) {
      storedToken = localStorage.getItem("auth");
    }

    if (storedToken) {

      this.techService.authWithToken(storedToken, function(error: any, redirectUrl: string) {

          if (error) {
            // We should have an error route but for now just redirect

          }
        
          router.navigate([redirectUrl]);
          return true;
      });
    }
    else {   

      // In all other cases
      router.navigate([this.techService.loginRoute]);
      return null;
    }
  }

}