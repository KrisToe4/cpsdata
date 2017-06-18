import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as passport from 'passport';
import * as cors from 'express-cors';

import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { IndexRoute } from "./routes/index";

import { AuthenticateRoute } from "./routes/tech/authenticate";
import { TechListRoute } from './routes/tech/list';
import { LogoutRoute } from "./routes/tech/logout";
import { ProfileRoute } from "./routes/tech/profile";
import { RegisterRoute } from "./routes/tech/register";
import { UpdateRoute } from "./routes/tech/update";

import { InspectionListRoute } from './routes/inspection/list';
import { InspectionGenerateRoute } from './routes/inspection/generate';

import { TechManager } from "./data-managers/tech-manager";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add data managers
    this.managers();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //use logger middlware
    this.app.use(logger("dev"));

    //use json form parser middlware
    this.app.use(bodyParser.json());

    //use query string parser middlware
    this.app.use(bodyParser.urlencoded({ extended: true }));

    //use cookie parker middleware. Enable signed cookies by passing a secret
    //this.app.use(cookieParser("SECRET_GOES_HERE"));
    this.app.use(cookieParser());

    //use override middleware
    this.app.use(methodOverride());

    this.app.use(passport.initialize());

    // Enable CORS for localhost
    this.app.use(cors({
        allowedOrigins: [ 'localhost:4200' ]
    }));

    //catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create router for RESTful API
   *
   * @class Server
   * @method routes
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    //Route List
    IndexRoute.create(router);

    // Tech Routes
    AuthenticateRoute.create(router);
    TechListRoute.create(router);
    LogoutRoute.create(router);
    ProfileRoute.create(router);
    RegisterRoute.create(router);
    UpdateRoute.create(router);

    // Inspection Routes
    InspectionListRoute.create(router);
    InspectionGenerateRoute.create(router);

    //use router middleware
    this.app.use('/api', router);
  }

  private managers() {
    let techManager = TechManager.Manager();
  }

}