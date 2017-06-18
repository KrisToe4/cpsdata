import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";

import { BaseRoute } from "../route";
import { ResponseData } from '../../data-classes/api-model';

import { Inspection } from '../../data-classes/inspection-model';
import { InspectionManager } from "../../data-managers/inspection-manager";

import { Tech } from '../../data-classes/tech';
import { TechManager } from "../../data-managers/tech-manager";

/**
 * / route
 *
 * @class User
 */
export class InspectionListRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class InspectionListRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[InspectionListRoute::create] Creating inspection list route.");

    //add login route
    router.post('/inspection/list', (req: Request, res: Response, next: NextFunction) => {
      new InspectionListRoute().loadList(req, res, next);
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

    if (req.body.auth) {

        let route = this;
        let techManager = TechManager.Manager();
        let inspectionManager = InspectionManager.Manager();

        techManager.validateAuthToken(req.body.auth, req.connection.remoteAddress, function (err: any, authorizedTech?: number) {

            if (err) {
                route.sendError(res, "Fatal error. Message: " + err);
                return;
            }

            if ((authorizedTech == undefined) || (authorizedTech < 0)) {
                route.sendError(res, "Login required");
                return;
            }

            inspectionManager.getList({ techID: authorizedTech }, function (error: any, list: any) {

                if (error) {

                    route.sendError(res, "Failed to load inspection list. Error: " + error);
                    return;
                }

                let respData: ResponseData = new ResponseData(null, "Inspection list retrieved", list);
                route.sendJSON(res, respData);
            });
        });
    }
    else {
      this.sendError(res, "Not authorized to view this information.");
    }
  }
}