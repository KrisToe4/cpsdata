import { NextFunction, Request, Response } from "express";

import { ResponseData } from '../data-classes/api-model';

/**
 * Constructor
 *
 * @class BaseRoute
 */
export class BaseRoute {

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor() {
  }

  /**
   * Send JSON string.
   *
   * @class BaseRoute
   * @method sendJSON
   * @param req {Request} The request object.
   * @param res {Response} The response object.
   * @param data {JSON} The data to send 
   * @return void
   */
  public sendJSON(res: Response, data: ResponseData) {
    res.json(data);
  }

  public sendError(res: Response, error: string) {
    let errorResponse: ResponseData = new ResponseData(error);
    this.sendJSON(res, errorResponse);
  }
}