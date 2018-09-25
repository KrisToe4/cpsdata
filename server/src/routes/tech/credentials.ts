import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";

import { BaseRoute } from "../route";
import { ResponseData } from '../../data-classes/api-model';

import { TechManager } from "../../data-managers/tech-manager";

import { MailManager } from "../../data-managers/mail-manager";
import { Tech } from "../../data-classes/tech";

/**
 * / route
 *
 * @class User
 */
export class CredentialsRoute extends BaseRoute {

  /**
   * Create the route.
   *
   * @class PasswordRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[CredentialsRoute::create] Creating credentials route.");

    //add credentials route
    router.post('/tech/credentials', (req: Request, res: Response, next: NextFunction) => {
      new CredentialsRoute().update(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class CredentialsRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The credentials api route.
   *
   * @class CredentialsRoute
   * @method update
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public update(req: Request, res: Response, next: NextFunction) {

    let route = this;

    // # Currently we're only allowing resetting but in the future this might change
    // TODO - let action = req.body.action;

    let manager = TechManager.Manager();
    manager.findTech(req.body.email, function (error: any, techID?: number) {

      // TODO - Implement other options or remove this comment
      //switch (action) 

      // For password reset actions we don't want to process errors beyond maybe logging them, for now do nothing.
      // This also applies to requests that don't match an existing tech email
      if ((error != null) || (techID == -1)) {
        return;
      }

      let tech = manager.loadTech(techID, function (error: any, tech: Tech) {

        if (error) {
          // TODO: Log admin error here
          return;
        }

        let techEmail = tech.profile.email;

        if ((techEmail != undefined) && (techEmail != "")) {

          // Here we're generating special temporary auth_tokens used for certain functions such as registration.
          // These last an hour instead of 7 days and are sent via email to users
          manager.generateAuthToken(techID, "*", function (tokenError: string, token?: string) {

            if (tokenError) {
              // TODO: Log admin error here
              return;
            }

            // *Note: the token at this point is almost for sure going to be valid. The "x || 0" syntax
            //        is a result of using the conditional for the generic functions return signature
            MailManager.sendPasswordReset(techEmail, token || "");    

            // For now send back confirmation to user with token for R&D
            let respData: ResponseData = new ResponseData(null, "Check your email for details on resetting your password!");
            route.sendJSON(res, respData);
          });
        }
      });
    });
  }
}