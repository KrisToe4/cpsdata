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
export class InspectionLoadRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class InspectionLoadRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[InspectionLoadRoute::create] Creating inspection load route.");

    //add login route
    router.post('/inspection/load', (req: Request, res: Response, next: NextFunction) => {
      new InspectionLoadRoute().load(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class InspectionLoadRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The inspection load api route.
   *  Body: {auth: AuthToken, data: {id: number}}
   *
   * @class InspectionLoadRoute
   * @method load
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public load(req: Request, res: Response, next: NextFunction) {

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

            inspectionManager.getInspection({tech:authorizedTech,id:req.body.data.id}, function(error: string, inspection: string) {
                
                if (error) {

                    route.sendError(res, "Fatal error. Message: " + err);
                    return;
                }
                
                let respData: ResponseData = new ResponseData(null, "Inspection loaded", inspection);
                route.sendJSON(res, respData);
            })
        });
    }
    else {
      this.sendError(res, "Not authorized to this action.");
    }
  }
}