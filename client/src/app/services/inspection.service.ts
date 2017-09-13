import { Injectable } from '@angular/core';
import { Headers,
         Http,
         Response,
         ResponseOptions,
         RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { TechService } from './tech.service';

import { Inspection,
         Waiver } from '@server-src/data-classes/inspection-model';

import { Tech, 
         TechList } from '../data-classes/tech';

import { TechCredential } from '@server-src/data-classes/tech-model';

import { RequestData,
         ResponseData } from '@server-src/data-classes/api-model';

@Injectable()
export class InspectionService extends ApiService {

  public static waiverRoute: string = "/tech/inspection/waiver";

  private static activeInspection: Inspection = new Inspection();
  public static activeSubject: BehaviorSubject<Inspection> = new BehaviorSubject<Inspection>(InspectionService.activeInspection);

  private static inspectionList: Inspection[];
  public static listSubject: BehaviorSubject<Inspection[]> = new BehaviorSubject<Inspection[]>([]);

  constructor( protected http: Http,
               private techService: TechService ) {
    super(http);

    // Subset to the inspection api branch
    this.serverRoute += "inspection/";
  }

  public watchList(): Observable<Inspection[]> {

    return InspectionService.listSubject.asObservable();
  }

  public updateList(): Promise<boolean> {

    let service: InspectionService = this;

    return new Promise(resolve => {

        service.getList(function (error: string) {

            if (error) {

                resolve(false);
            }
            else {

                resolve(true);
            }
        });
    });
  }

  public watchActive(): Observable<Inspection> {

    return InspectionService.activeSubject.asObservable();
  }

  public checkWaiver(): boolean {

    if (InspectionService.activeInspection.waiver && InspectionService.activeInspection.waiver.signed) {

      return true;
    }

    return false;
  }

  public acceptWaiver(name: string, signature: string) { 
    
    InspectionService.activeInspection.acceptWaiver(name, signature); 
  }

  public createInspection(data: any, callback: (error?: string) => void) {

    let service: InspectionService = this;

    let request: RequestData = new RequestData("generate", { 
      auth: this.techService.getAuthToken(),
      data: data
    });

    this.inspectionApi(request).subscribe(
      (response: ResponseData) => {

        if (response["error"]) {
          callback(response["error"]);
        }
        else {

          service.setActive(response.data as number || 0)
          callback(null);
        }
      },
      error => alert("Error creating inspection. Message: " + error)
    );
  }

  public setActive(id: number) {

    this.getInspection(id, function (error: string, inspection: Inspection) {

      if (InspectionService.activeInspection.id != inspection.id) {

        InspectionService.activeInspection = inspection;
        InspectionService.activeSubject.next(inspection);
      }
    });
  }

  /** Private methods that interface with the API itself **/
  private getList(callback: (error: string) => void) {

    let request: RequestData = new RequestData("list", { 
      auth: this.techService.getAuthToken()
    });

    this.inspectionApi(request).subscribe(
      (response: ResponseData) => {

        if (response["error"]) {
          callback(response["error"]);
        }
        else {

          InspectionService.inspectionList = response.data as Inspection[];  
          InspectionService.listSubject.next(InspectionService.inspectionList);
          callback(null);
        }
        
      },
      error => alert("Error retrieving inspection list. Message: " + error)
    );
  }

  //private update()

  private getInspection(id: number, callback: (error?: string, inspection?: Inspection) => void) {

    // *** We'll want to check our local store first, but for now load from the server ***


    let request: RequestData = new RequestData("load", { 
      auth: this.techService.getAuthToken(),
      data: {
        id: id
      } 
    });

    this.inspectionApi(request).subscribe(
      (response: ResponseData) => {

        if (response["error"]) {

          callback(response["error"]);
        }
        else {

          let inspection: Inspection = new Inspection();
          inspection.fromJSON(response.data);
          
          callback(null, inspection);
        }
        
      },
      error => alert("Error retrieving inspection with id: " + id + " Message: " + error)
    );
  }
   
  private inspectionApi(request: RequestData): Observable<ResponseData> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.serverRoute + request.route, request.data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}