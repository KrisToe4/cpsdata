import { NextFunction, 
         Request, 
         Response, 
         Router } from "express";
import * as passport from 'passport';

import { BaseRoute } from "../route";

import { Action,
         ActionList } from '../../data-classes/action';
import { ResponseData } from '../../data-classes/api-model';
import { TechCredential } from '../../data-classes/tech-model';

import { TechManager } from "../../data-managers/tech-manager";

/**
 * / route
 *
 * @class User
 */
export class AuthenticateRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[AuthenticateRoute::create] Creating auth route.");

    //add login route
    router.post('/tech/auth', (req: Request, res: Response, next: NextFunction) => {
      new AuthenticateRoute().authenticate(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The authentication route. 
   *  Body: { TechCredential }
   *
   * @class AuthenticateRoute
   * @method authenticate
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public authenticate(req: Request, res: Response, next: NextFunction) {
    let route = this;

    let credentials: TechCredential = new TechCredential(req.body);

    console.log(JSON.stringify(credentials));

    switch (credentials.type) {
      case "auth":
        credentials.ip = req.connection.remoteAddress;
        this.tokenAuthorization(credentials, res, route);
        break;
      case "local":
        // Set up the expected format for passport local authentication
        req.body = {
          email: credentials.value["email"] as string,
          password: credentials.value["password"] as string
        };
        this.localAuthorization(req, res, next, route);
        break;
      case "generate":
        let token = credentials.value.token;

        credentials = new TechCredential(credentials.value.credential);
        credentials.ip = req.connection.remoteAddress;    
        
        console.log(JSON.stringify(credentials));

        this.generate(token, credentials, res, route);
        break;
      default:
        route.sendError(res, "Credentials missing or invalid. Login failed");
        return;
    }
  }

  private generate(token: string, credential: TechCredential, res: Response, route: AuthenticateRoute) {

    let manager = TechManager.Manager();

    manager.validateAuthToken(token, "*", function (err: any, techID: number) {

      if (err) {
        route.sendError(res, "Authentication Token invalid.");
        return;
      }

      // Currently we only support local credential creation
      switch (credential.type) {
        case "local":
          manager.generateLocalCredentials(techID, credential, function (error: string) {

            if (err) {
              route.sendError(res, "Failed to generate credentials.");
              return;
            }

            console.log(techID);

            TechManager.Manager().generateAuthToken(techID, credential.ip, function (err: any, token?: string) {
              if (err) {
                route.sendError(res, "Credentials created but auth token failed to generate. Message: " + err);
              }
              else {
                let data: ResponseData = new ResponseData(null, "Credentials created.", { auth: token, actions: new ActionList(true).toJSON() });
                route.sendJSON(res, data);
              }
            });
          });
          break;
        default:
          route.sendError(res, "Credential type invalid");
          return;
      }
    });
  }

  private tokenAuthorization (credential: TechCredential, res: Response, route: AuthenticateRoute) {
    
    TechManager.Manager().validateAuthToken(credential.value, credential.ip, function(err: any, techID: number) {

      if (techID >= 0) {
        let respData: ResponseData = new ResponseData(null, "Token Valid", {actions: new ActionList(true).toJSON()});
        route.sendJSON(res, respData);
        return;
      }

      route.sendError(res, "Authentication Token invalid.");
    });
  }  

  private localAuthorization (req: Request, res: Response, next: NextFunction, route: AuthenticateRoute) {

      passport.authenticate('local', function (err: any, user: any, info: any) {
        if (err) {
          route.sendError(res, "Fatal error while attempting authentication. Error: " + err);
          return;
        }

        if (user === -1) {
          route.sendError(res, "Email or password are not valid.");
        }
        else {
          TechManager.Manager().generateAuthToken(user, req.connection.remoteAddress, function(err: any, token?: string) {
            if (err) {
              route.sendError(res, "Login Successful but authToken failed to generate. Message: " + err);
            } 
            else {
              let data: ResponseData = new ResponseData(null, "Login Successful.", {auth: token, actions: new ActionList(true).toJSON()});
              route.sendJSON(res, data);

            }
          });
        }
      })(req, res, next);
  }    
}