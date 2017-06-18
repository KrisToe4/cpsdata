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
export class TechListRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class TechListRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[TechListRoute::create] Creating tech list route.");

    //add login route
    router.post('/tech/list', (req: Request, res: Response, next: NextFunction) => {
      new TechListRoute().loadList(req, res, next);
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
  public loadList(req: Request, res: Response, next: NextFunction) {

    if (req.body.org) {

      let route = this;
      let manager = TechManager.Manager();

      manager.getTechList(req.body, function (error: any, list: any) {

        if (error) {

          route.sendError(res, "Failed to load list of techs. Error: " + error);
          return;
        }

        let respData: ResponseData = new ResponseData(null, "Tech list retrieved", list);
        route.sendJSON(res, respData);
      });
    }
    else {
      this.sendError(res, "A certification organization is required.");
    }
  }
}