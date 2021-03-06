import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import * as passport from 'passport';

import { BaseRoute } from "../route";
import { ResponseData } from '../../data-classes/api-model';

import { Tech } from '../../data-classes/tech'
import { TechCredential } from '../../data-classes/tech-model';
import { TechManager } from "../../data-managers/tech-manager";

import { MailManager } from "../../data-managers/mail-manager";

/**
 * / route
 *
 * @class User
 */
export class UpdateRoute extends BaseRoute {

  /**
   * Create the route.
   *
   * @class UpdateRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[UpdateRoute::create] Creating update route.");

    //add login route
    router.post('/tech/update', (req: Request, res: Response, next: NextFunction) => {
      new UpdateRoute().update(req, res, next);
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
   * The tech update api route.
   *  Body: {
   *          auth: AuthToken,
   *          data: Tech
   *        }
   *
   * @class UpdateRoute
   * @method update
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public update(req: Request, res: Response, next: NextFunction) {

    let route = this;
    let techJSON = req.body.data;

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
        route.sendError(res, "Login required");
        return;
      }
      //*******************************************************/

      //*******************************************************/

      // Eventually we'll check if the tech being modified is not ours but for now we can skip that part
      /*
      manager.findTech(req.body.email, function (error: any, requestedTech?: number) {
        if (error) {
          if (requestedTech != undefined) {
            res.json({
              "info": "Tech Not Found. Registration required"
            });
          }
          else {
            res.json({
              "error": "SQL Error. Message: " + error
            });
          }

          return;
        }

        if (requestedTech != undefined) {
        

          if (authorizedTech != requestedTech) {
            // Eventually we'll provide authority for admin's to load all techs but for now throw an error
            res.json({
              "error": "Not authorized to this action."
            });
            return;
          }
          */

      manager.updateTech(authorizedTech, techJSON, function (error: string, certConfirmEmail?: string) {
        if (error) {

          route.sendError(res, "Update failed. Message: " + error);
        }
        else {

          // Send out cert confirmation email if this was a newly added certification
          if (certConfirmEmail != "") {
            let details = {

              name: techJSON.name,
              email: techJSON.email,
              certOrg: techJSON.certOrg,
              certType: techJSON.certType,
              certDate: techJSON.certDate
            }

            // *Note: the email address has already been checked so the syntax 'email || ""'  
            //        is a result of using the conditional for the generic functions return signature
            MailManager.sendCertConfirmation(certConfirmEmail || "", details);
          }

          let respData: ResponseData = new ResponseData(null, "Profile updated");
          route.sendJSON(res, respData);
        }
      });
    });

  }
}