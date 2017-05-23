import { NextFunction, 
         Request, 
         Response, 
         Router } from "express";

import { BaseRoute } from "../route";
import { ResponseData } from '../../data-classes/api-model';

import { TechManager } from "../../data-managers/tech-manager";

/**
 * / route
 *
 * @class User
 */
export class LogoutRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[LogoutRoute::create] Creating logout route.");

    //add login route
    router.post('/tech/logout', (req: Request, res: Response, next: NextFunction) => {
      new LogoutRoute().logout(req, res, next);
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
   * The home page route.
   *
   * @class LoginRoute
   * @method login
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public logout(req: Request, res: Response, next: NextFunction) {

    TechManager.Manager().deleteAuthToken(req.body.auth, function (error: any) {
      if (error) {
        res.json({
          "error": "Logout failed. Message: " + error
        });
      }
      else {
        res.json({
          "message": "Logout Successful.",
        });
      }
    });
  }
}