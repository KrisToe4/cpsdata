import { Injectable } from '@angular/core';
import { Response} from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ResponseData } from '@server-src/data-classes/api-model';

@Injectable()
export class HttpService {

  protected constructor() { }

  protected extractData(res: Response) {
    let response: ResponseData = res.json() as ResponseData || new ResponseData("Data Error on Request");
    return response;
  }
  
  protected handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
