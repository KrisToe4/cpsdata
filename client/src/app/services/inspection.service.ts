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

import { Inspection } from '@server-src/data-classes/inspection-model';

import { Tech, 
         TechList } from '../data-classes/tech';

import { TechCredential } from '@server-src/data-classes/tech-model';

import { RequestData,
         ResponseData } from '@server-src/data-classes/api-model';

@Injectable()
export class InspectionService extends ApiService {

  private static activeInspection: Inspection;

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

  public updateList(): Promise<true> {

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

          console.log(response.data);
          InspectionService.activeInspection = response.data as Inspection;
          service.updateList().then(updateSucceeded => {

            if (updateSucceeded) {
              callback(null);
            }
            else {
              callback("Inspection created but list update failed");
            }
          });
        }
      },
      error => alert("Error creating inspection. Message: " + error)
    );
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
   
  private inspectionApi(request: RequestData): Observable<ResponseData> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.serverRoute + request.route, request.data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}