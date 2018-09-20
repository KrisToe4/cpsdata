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

import { Tech, 
         TechList } from '../data-classes/tech';

import { TechCredential } from '@server-src/data-classes/tech-model';
import { RequestData,
         ResponseData } from '@server-src/data-classes/api-model';

@Injectable()
export class TechService extends ApiService {

  // Not to be confused with the API, this is the client side angular route
  public loginRoute: string = '/tech/login';

  private static tech: Tech = new Tech();

  constructor( protected http: Http ) {
    super(http);

    // Subset to the tech api branch
    this.serverRoute += "tech/";

  }

  public getAuthToken(): string {

    return TechService.tech.authToken;
  }

  /* Authenticate With Token */
  public authWithToken(storedToken: string, callback: (error: string, redirectUrl?: string) => void) {

    let service: TechService = this;
    
    let authRequest: TechCredential = new TechCredential({
        type: "auth",
        value: storedToken
    });

    this.authenticate(authRequest, function(error: string, authData: any, redirectUrl: string) {

        if (error) {

          callback(error, service.loginRoute);
        }
      else {

        authData.auth = storedToken;
        TechService.tech.storeAuthData(authData, function (token: string) {

          service.loadProfile(function (error: string, techData: any) {

            if (error) {
              callback(error, service.loginRoute);
              return;
            }

            TechService.tech.storeProfile(techData);
            callback(null, redirectUrl);
          });
        });
      }
    });
  }

  /* Authenticate with Email/Password */
  public authWithLocal(email: string, password: string, callback: (error: string, auth?: string, redirectUrl?: string) => void) {

    let service: TechService = this;

    let authRequest: TechCredential = new TechCredential({
        type: "local",
        value: {
          email: email,
          password: password
        }
    });

    this.authenticate(authRequest, function (error: string, authData: any, redirectUrl: string) {

      if (error) {

        callback(error, null, service.loginRoute);
      }
      else {
        TechService.tech.storeAuthData(authData, function (token: string) {

          service.loadProfile(function (error: string, techData: any) {

            if (error) {
              callback(error, null, service.loginRoute);
              return;
            }

            TechService.tech.storeProfile(techData);
            callback(null, token, redirectUrl);
          });
        });
      }
    });
  }

  public storePassword(auth: string, password: string, trigger: string, callback: (error: string, auth?: string, redirectUrl?: string) => void) {
    let service: TechService = this;

    let authRequest: TechCredential = new TechCredential({
      type: "generate",
      value: {
        token: auth,
        trigger: trigger,
        credential: new TechCredential({
          type: "local",
          value: password
        })
      }
    });

    console.log(authRequest);

    this.authenticate(authRequest, function (error: string, authData: any, redirectUrl: string) {

      if (error) {

        callback(error);
      }
      else {
        
        TechService.tech.storeAuthData(authData, function (token: string) {

          service.loadProfile(function (error: string, techData: any) {

            if (error) {
              callback(error, null, service.loginRoute);
              return;
            }

            TechService.tech.storeProfile(techData);
            callback(null, token, redirectUrl);
          });
        });
      }
    });
  }

  /* Logout and deauthenticate */
  public logout() {
    return Promise.resolve(TechService.tech.clearAuthData()).then(logoutSucceeded => true);
  }

  public getTechMenuTree(): Observable<any> {
    return TechService.tech.getMenuTree();
  }

  public getProfileObserver(): Observable<any> {
    return TechService.tech.getProfileObserver();
  }

  public getMapEntryObserver(): Observable<any> {
    return TechService.tech.getMapEntryObserver()
  }

  public getTechProfile(): any {
    return {
      profile: TechService.tech.profile,
      mapEntry: TechService.tech.mapEntry
    }
  }

  public updateTechProfile(data: any, callback: (error: string) => void ) {

    TechService.tech.updateFromObject(data);
    this.updateProfile(callback);
  }

  public register(email: string, callback: (error: string) => void) {

    let request: RequestData = new RequestData("register", {
      email: email
    });

    this.techApi(request).subscribe(
      (response: ResponseData) => {

        if (response["error"]) {
          callback(response["error"]);
        }
        else {
          callback(null);
        }
      },
      error => alert("Registration Error. Message: " + error)
    );
  }

  public getTechList(org: string, location: any, callback: (error: string, list?: TechList) => void) {

    // Max Radius is calculated in KM
    let request: RequestData = new RequestData("list", {
      org: org,
      maxRadius: 25,
      location: location
    });

    this.techApi(request).subscribe(
      (response: ResponseData) => {

        if (response["error"]) {
          callback(response["error"]);
        }
        else {

          let techList: TechList = new TechList(response.data);  
          callback(null, techList);
        }
        
      },
      error => alert("Error retrieving tech list. Message: " + error)
    );
  }

  /** Private methods that interface with the API itself ** //
   * 
  /* Load profile information. This is done as part of authentication */
  private loadProfile( callback: (error: string, techData?: any) => void ) {
  
    let request: RequestData = new RequestData("profile", { 
      auth: TechService.tech.authToken 
    });

    this.techApi(request).subscribe(
      (response: ResponseData) => { 

        if (response["error"]) {
          callback(response["error"]);
        }
        else {
          callback(null, response.data); 
        }
      },
       error => alert("Profile Error. Message: " + error)
    );
  }

    /* Update profile information */
  private updateProfile( callback: (error: string) => void ) {
  
    let request: RequestData = new RequestData("update", { 
      auth: TechService.tech.authToken,
      data: TechService.tech.toJSON() 
    });

    this.techApi(request).subscribe(
      (response: ResponseData) => { 

        if (response["error"]) {
          callback(response["error"]);
        }
        else {
          callback(null); 
        }
      },
       error => alert("Profile Error. Message: " + error)
    );
  }

  private techApi(request: RequestData): Observable<ResponseData> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.serverRoute + request.route, request.data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}