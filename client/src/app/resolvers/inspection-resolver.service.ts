import { Injectable }     from '@angular/core';
import { ActivatedRouteSnapshot,
         RouterStateSnapshot,
         Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LocalStorageModule } from 'angular-2-local-storage';

import { Inspection } from '@server-src/data-classes/inspection-model';
import { InspectionService } from '@services/inspection.service';

@Injectable()
export class InspectionResolverService implements Resolve<boolean> {

  constructor( private inspectionService: InspectionService ) {  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    console.log("Inspection resolver");

    return this.inspectionService.updateList();
  }
}
