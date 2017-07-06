import { Injectable }     from '@angular/core';
import { Router,
         CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot, } from '@angular/router';

import { Inspection } from '@server-src/data-classes/inspection-model';
import { InspectionService } from '@services/inspection.service';

@Injectable()
export class WaiverGuardService implements CanActivate {

  constructor ( private inspectionService: InspectionService,
                private router: Router ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    console.log("Route: " + route + " State: " + state);

    let router: Router = this.router;

    if (this.inspectionService.checkWaiver()) {
        return true;
    }
    
    // In all other cases
    this.router.navigate([InspectionService.waiverRoute]);
    return null;
  }

}