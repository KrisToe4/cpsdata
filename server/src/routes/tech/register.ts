import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import * as passport from 'passport';

import { BaseRoute } from "../route";
import { ResponseData } from '../../data-classes/api-model';

import { Tech } from '../../data-classes/tech';
import { TechCredential } from '../../data-classes/tech-model';
import { TechManager } from "../../data-managers/tech-manager";

import { MailManager } from "../../data-managers/mail-manager";

/**
 * / route
 *
 * @class User
 */
export class RegisterRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[RegisterRoute::create] Creating registration route.");

    //add login route
    router.post('/tech/register', (req: Request, res: Response, next: NextFunction) => {
      new RegisterRoute().register(req, res, next);
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
   * The registration api route.
   *
   * @class RegisterRoute
   * @method register
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public register(req: Request, res: Response, next: NextFunction) {

    let route = this;

    let manager = TechManager.Manager();
    manager.findTech(req.body.email, function (error: any, techID?: number) {
      if (error == null) {
        route.sendError(res, "Email address already registered");
        return;
      }

      if (techID == -1) {

        let techEmail = req.body.email;

        manager.addTech(techEmail, function (err: any, techID?: number) {
          if (err) {

            route.sendError(res, "Registration failed. Message: " + err);
            return;
          }

          if (techID != undefined) {

            // Here we're generating special temporary auth_tokens used for certain functions such as registration.
            // These last an hour instead of 7 days and are sent via email to users
            manager.generateAuthToken(techID, "*", function (error: string, token?: string) {

              if (err) {

                route.sendError(res, "Registration failed. Message: " + err);
                return;
              }

              // *Note: the token at this point is almost for sure going to be valid. The "x || 0" syntax
              //        is a result of using the conditional for the generic functions return signature
              MailManager.sendVerification(techEmail, token || "");    

              // For now send back confirmation to user with token for R&D
              let respData: ResponseData = new ResponseData(null, "Profile Created");
              route.sendJSON(res, respData);
            });
          }
        });
      }
      else {
        route.sendError(res, "SQL Message: " + error);
      }
    });
  }
}