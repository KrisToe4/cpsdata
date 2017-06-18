import { Injectable } from '@angular/core';
import { Headers,
         Http,
         Response,
         ResponseOptions,
         RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
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

  constructor( protected http: Http,
               private techService: TechService ) {
    super(http);

    // Subset to the inspection api branch
    this.serverRoute += "inspection/";
  }

  public updateList(): Promise<Inspection[]> {

    let service: InspectionService = this;

    return new Promise(resolve => {

        service.getList(function (error: string, list: Inspection[]) {

            if (error) {

                resolve([]);
            }
            else {

                resolve(list);
            }
        });
    });
  }

  private getList(callback: (error: string, list?: Inspection[]) => void) {

    let request: RequestData = new RequestData("list", { 
      auth: this.techService.getAuthToken()
    });

    this.inspectionApi(request).subscribe(
      (response: ResponseData) => {

        if (response["error"]) {
          callback(response["error"]);
        }
        else {

          let list: Inspection[] = response.data as Inspection[];  
          callback(null, list);
        }
        
      },
      error => alert("Error retrieving inspection list. Message: " + error)
    );
  }

  /** Private methods that interface with the API itself **/
   
  private inspectionApi(request: RequestData): Observable<ResponseData> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.serverRoute + request.route, request.data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}