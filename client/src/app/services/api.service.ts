import { Injectable } from '@angular/core';
import { Headers,
         Http,
         Response,
         ResponseOptions,
         RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpService } from './http.service'

import { RequestData,
         ResponseData } from '@server-src/data-classes/api-model';
import { TechCredential } from '@server-src/data-classes/tech-model';

@Injectable()
export class ApiService extends HttpService {
    
  protected serverRoute: string = '/api/tech/';

  public requestedUrl: string;

  constructor( protected http: Http ) {
      super();
  }

  protected authenticate( authRequest: TechCredential, 
                          callback: (error: string, authData?: any, redirectUrl?: string) => void) {
  
    this.authorizeApi(authRequest).subscribe(
      (response: ResponseData) => { 

        if (response["error"]) {
          callback(response["error"]);
        }
        else {
          callback(null, response.data, this.requestedUrl); 
        }
      },
       error => alert("Login Error. Message: " + error)
    );
  }

  private authorizeApi(authRequest: TechCredential): Observable<ResponseData> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.serverRoute + "auth", authRequest, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}