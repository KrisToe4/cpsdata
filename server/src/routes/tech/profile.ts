import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";

import { BaseRoute } from "../route";
import { ResponseData } from '../../data-classes/api-model';

import { Tech } from '../../data-classes/tech';
import { TechManager } from "../../data-managers/tech-manager";

/**
 * / route
 *
 * @class User
 */
export class ProfileRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[ProfileRoute::create] Creating profile route.");

    //add login route
    router.post('/tech/profile', (req: Request, res: Response, next: NextFunction) => {
      new ProfileRoute().load(req, res, next);
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
   * The tech profile api route.
   *  Body: {auth: AuthToken}
   *
   * @class ProfileRoute
   * @method load
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public load(req: Request, res: Response, next: NextFunction) {

    let route = this;

    // Before each request check if the authtoken is valid.
    // This should be turned into a middleware or moved to the baseroute in some way
    // ************************************
    let manager = TechManager.Manager();
    manager.validateAuthToken(req.body.auth, req.connection.remoteAddress, function (err: any, authorizedTech?: number) {
      if (err) {
        route.sendError(res, "Fatal error. Message: " + err);
        return;
      }

      if ((authorizedTech == undefined) || (authorizedTech < 0)) {

        route.sendError(res, "Login required.");
        return;
      }

      console.log("Tech authorized. ID:" + authorizedTech);
      //*******************************************************/

      // Eventually we'll check if the tech being modified is not ours but for now we can skip that part
      /*
      manager.findTech(req.body.email, function (error: any, requestedTech?: number) {
        if (error) {
          if (requestedTech != undefined) {

            route.sendError(req, res, "Tech Not Found. Registration required");
          }
          else {

            route.sendError(req, res, "SQL Error. Message: " + error);
          }

          return;
        }

        if (requestedTech != undefined) {

          if (authorizedTech != requestedTech) {

            // Eventually we'll provide authority for admin's to load all techs but for now throw an error
            route.sendError(req, res, "Not authorized to this action.");
            return;
          }
        }
      });
      */

      manager.loadTech(authorizedTech, function (error: any, tech: Tech) {

        if (error) {

          route.sendError(res, "Failed to load tech profile. Error: " + error);
          return;
        }

        let respData: ResponseData = new ResponseData(null, "Profile Found", tech);
        route.sendJSON(res, respData);
      });
    });
  }
}