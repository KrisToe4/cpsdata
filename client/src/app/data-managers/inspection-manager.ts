import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { LocalStorageModule } from 'angular-2-local-storage';

import { ApiService } from '../services/api.service';
import { InspectionService } from '../services/inspection.service';

import { Inspection,
         Waiver } from '@server-src/data-classes/inspection-model';

@Injectable()
export class InspectionManager {
    
    inspections: any;

    constructor(private inspectionService: InspectionService) { 
        
        let manager: InspectionManager = this;

        this.inspectionService.watchList().subscribe(list => {

            manager.loadInspections(list);
        });
    }

    private loadInspections(list: Inspection[]) {

        // ** We need to check for inspections with local changes (before blowing them away) **

        this.inspections = {};
        list.forEach(inspection => { this.addInspection(inspection); });

        this.storeInspections();
    }

    private storeInspections() {

        localStorage.setItem("inspections", JSON.stringify(this.inspections));
    }

    /*************************************/

    public watchList(): Observable<Inspection[]> {

        return this.inspectionService.watchList();
    }

    public watchActive(): Observable<Inspection> {

        return this.inspectionService.watchActive();
    }

    public setActive(id: number) {

        this.inspectionService.setActive(id);
    }

    public addInspection(inspection: Inspection) {

        inspection.state = "server";
        this.inspections[inspection.id] = inspection;
    }

    public updateInspection(inspection: Inspection) {

        inspection.state = "local";
        this.inspections[inspection.id] = inspection;
    }

    public deleteInspection(inspection: Inspection) {

        delete(this.inspections[inspection.id]);
    }
}