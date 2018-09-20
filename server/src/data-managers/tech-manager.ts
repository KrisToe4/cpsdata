import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import * as FacebookStrategy from 'passport-facebook';

const Credentials = require('credentials')();

import { DatabaseManager } from './db-manager';

import { Menu,
         MenuItem } from '../data-classes/menu-model';

import { Tech } from '../data-classes/tech';
import { TechCredential,
         TechProfile } from '../data-classes/tech-model';


/**
 * Constructor
 *
 * @class TechManager
 */
export class TechManager {

    private static manager: TechManager;

    public static Manager(): TechManager {
        if (this.manager == null) {
            this.manager = new TechManager();
        }
        return this.manager;
    }

    /**
     * Constructor
     *
     * @class TechManager
     * @constructor
     */
    constructor() {
        // Set up passport strategies for authentication
        passport.use(new LocalStrategy.Strategy({ 
            usernameField: 'email',
            passwordField: 'password'
        }, this.validateLocalCredentials));
    }

    public findTech(email: string, callback: (err: any, techID?: number) => void) {

        let db = DatabaseManager.getConnection();
        db.query('SELECT id from tech_profile where email = ?', [email], function (error, results, fields) {
            if (error) {
                callback(error);
            }

            if (results.length > 0) {

                callback(null, results[0].id);
            }
            else {

                callback("Tech Not Found.", -1);
            }

        });
    }

    public loadTech(techID: number, callback: (err: any, tech: Tech) => void) {

        let db = DatabaseManager.getConnection();
        db.query('SELECT status, email, name from tech_profile where id = ?', [techID], function (error, results, fields) {
            
            if (error) {
                callback(error, new Tech());
                return;
            }

            if (results.length > 0) {

                let techJSON = results[0];
    
                let sqlQuery: string = 'SELECT org, type, certDate, valid ' +
                                        'FROM tech_certification tc  ' +
                                        'INNER JOIN certifications c ON tc.certID = c.id ' +
                                        'WHERE tc.techID = ?' ;             

                db.query(sqlQuery, [techID], function (error, certResults, fields) {

                    if (error) {
                        callback(error, new Tech());
                        return;
                    }

                    // If we have map entry details add them to the JSON object
                    if (certResults.length > 0) {

                        techJSON.cert = certResults[0];  
                    }     
                        
                    db.query('SELECT * from tech_contact where techID = ?', [techID], function (error, mapResults, fields) {
                        if (error) {
                            callback(error, new Tech());
                            return;
                        }
    
                        // If we have map entry details add them to the JSON object
                        if (mapResults.length > 0) {
    
                            techJSON.mapEntry = mapResults[0];                    
                        }

                        console.log(techJSON);
    
                        let tech: Tech = new Tech();
                        tech.storeProfile(techJSON);
                        callback(null, tech);
                    });
                    
                });
            }
            else {
                callback("Tech Not Found.", new Tech());
            }

        });
    }

    public getTechList(options: any, callback: (error: any, list?: any) => void) {

        // Eventually we'll allow admins to load a detailed list for maintenance but for now just ignore the auth value
        if (options.auth) {

        }

        // The query depends on whether they are filtering on location or not
        let sqlQuery: string = '';
        if (options.maxRadius && options.location)
        {
            // To calculate the right radius we need a magic number
            // KM = 6371
            // Miles = 3959
            // Not really magic, just mathy wathy
            let magicNumber = 6371

            sqlQuery = 'SELECT p.id, name, type, tcon.*, ' +
                       '(' + magicNumber + ' * acos (' +
                       ' cos ( radians(' + options.location.geoLat + ') )' +
                       ' * cos ( radians( tcon.geoLat ) ) ' + 
                       ' * cos ( radians( tcon.geoLng ) - radians(' + options.location.geoLng + ') )' +
                       ' + sin ( radians(' + options.location.geoLat + ') )' +
                       ' * sin ( radians( tcon.geoLat ) )' +
                       ' ) ' +
                       ') AS distance'
                       'FROM tech_profile p ' +
                       'INNER JOIN tech_contact tcon on p.id = tcon.techID ' +
                       'INNER JOIN tech_certification tcert on p.id = tcert.techID ' +
                       'INNER JOIN certifications c ON tcert.certID = c.id ' +
                       'WHERE p.status = "active" and tcon.public = "true" AND c.org = ? AND tcert.valid = "true" ' +
                       'HAVING distance < ' + options.maxRadius;
        }
        else
        {
            sqlQuery = 'SELECT p.id, name, type, tcon.* ' +
                       'FROM tech_profile p ' +
                       'INNER JOIN tech_contact tcon on p.id = tcon.techID ' +
                       'INNER JOIN tech_certification tcert on p.id = tcert.techID ' +
                       'INNER JOIN certifications c ON tcert.certID = c.id ' +
                       'WHERE p.status = "active" and tcon.public = "true" AND c.org = ? AND tcert.valid = "true"' ;
        }

        let db = DatabaseManager.getConnection();
        db.query(sqlQuery, [options.org], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if (results.length > 0) {

                let techList: any = []

                results.forEach((result: any) => {
                    techList.push({
                        id: result.id,
                        name: result.name,
                        cert: {
                            type: result.type
                        },
                        mapEntry: {
                            geoLat: result.geoLat,
                            geoLng: result.geoLng,
                            region: result.region,
                            email: result.email,
                            phone: result.phone,
                            phone2: result.phone2,
                            websiteName: result.websiteName,
                            websiteURL: result.websiteURL,
                            displayEmail: result.displayEmail,
                            displayPhone: result.displayPhone,
                            displayWebsite: result.displayWebsite
                        }
                    });
                });

                callback(null, techList);
                
            }
            else {
                callback("No Techs Found.");
            }
        });
    }


    /* Add/Update Methods */

    public addTech(email: string, callback: (err: any, techID?: number) => void) {

        let db = DatabaseManager.getConnection();
        db.query('INSERT into tech_profile set ? ', [{ "email": email }], function (error, results, fields) {
            if (error) {

                callback(error);
            }
            else {

                callback(null, results.insertId);
            }
        });

    }

    public verifyTech(techID: number, callback: (err: any) => void) {

        let db = DatabaseManager.getConnection();
        db.query("UPDATE tech_profile SET status = 'active' where id = ?", [techID], function (error, results, fields) {

            if (error) {

                callback(error);
            }
            else {

                callback(null);
            }
        });
    }

    public updateTech(techID: number, techJSON: any, callback: (err: any, certConfirmEmail?: string) => void) {

        let manager: TechManager = this;

        // For now we are not going to allow updates to the registered email and we're 
        // doing this in parts instead of one complicated UPDATE (which might come later)
        let db = DatabaseManager.getConnection();
        db.query('UPDATE tech_profile set name = ? where id = ?', [techJSON.name, techID], function (error, results, fields) {
            if (error) {

                callback(error);
                return;
            }

            let cert = techJSON.cert;

            manager.updateCertifications(techID, cert, function(error: string, certAdmin?: string) {

                if (error) {

                    callback(error);
                    return;
                }

                manager.updateContactInfo(techID, techJSON.mapEntry, function(error: string) {

                    if (error) {

                        callback(error);
                    }
                    else {

                        callback(null, certAdmin);
                    }
                });
            });
        });
    }

    private updateCertifications(techID: number, cert: any, callback: (error: any, certAdmin?: string) => void) {

        // Check if this tech already has the indicated certification. If they do update the certDate otherwise insert
        let db = DatabaseManager.getConnection();
        db.query('SELECT id, adminEmail FROM certifications ' +
                 'WHERE org = ? and type = ?',
                 [cert.org, cert.type], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if (results.length == 0) {

                callback("Certification Not Found");
                return;
            }

            let certID: number = results[0].id;
            let certAdmin: string = results[0].adminEmail;

            db.query("SELECT certDate from tech_certification where certID = ? and techID = ?", [certID, techID], function (error, results, fields) {

                if (error) {

                    callback(error);
                    return;
                }

                let certDate = new Date(cert.certDate);

                let sqlQuery = "";
                let sqlFields = [{}];

                if (results.length == 0) {

                    sqlQuery = 'INSERT INTO tech_certification set ?';
                    sqlFields = [{ techID: techID, certID: certID, certDate: certDate }];
                }
                else {

                    sqlQuery = 'UPDATE tech_certification set ? where techID = ? and certID = ?';
                    sqlFields = [{ certDate: certDate }, techID, certID];

                    // Reset the certAdmin here as we don't need to email them
                    certAdmin = "";
                }

                db.query(sqlQuery, sqlFields, function (error, results, fields) {
                    if (error) {

                        callback(error);
                    }
                    else {

                        callback(null, certAdmin);
                    }
                });
            });
        });
    }

    private updateContactInfo(techID: number, mapEntry: any, callback: (error: any) => void) {

        let db = DatabaseManager.getConnection();
        db.query('SELECT techID FROM tech_contact WHERE techID = ?', [techID], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            let sqlQuery: string;
            let sqlFields = [{}];

            if (results.length == 0) {

                mapEntry['techID'] = techID;
                sqlQuery = 'INSERT INTO tech_contact set ?';
                sqlFields = [mapEntry];
            }
            else {

                sqlQuery = 'UPDATE tech_contact set ? where techID = ?';
                sqlFields = [mapEntry, techID];
            }

            db.query(sqlQuery, sqlFields, function (error, results, fields) {
                if (error) {

                    callback(error);
                }
                else {

                    callback(null);
                }
            });
        });

    }
    /* ***************************** */


    //******** Authentication Methods ***********/
    /**
    * Generate user credentials based on email and password
    */
    public generateLocalCredentials(techID: number, credential: TechCredential, callback: (err: any) => void) {

        if (credential.type != "local") {
            callback("Invalid credential type");
            return;
        }

        Credentials.hash(credential.value).then(function (hash: string) {
            let newCredential = {
                techID: techID,
                type: credential.type,
                value: hash,
                ip: credential.ip
            };

            let db = DatabaseManager.getConnection();
            db.query('INSERT INTO tech_credentials SET ?', newCredential, function (error, results, fields) {
                if (error) {
                    callback(error);
                }

                callback(null);
            });
        });
    }

    /**
    * Validate user based on email and password
    */
    public validateLocalCredentials(username: string, password: string, done: any) {

        // Make sure the tech exists
        let manager = TechManager.Manager();
        manager.findTech(username, function (error: any, techID?: number) {
            if (error) {
                return done(error);
            }

            if (techID == -1) {
                return done(null, techID, "Tech not found");
            }

            // Find the local credentials we've stored in the past
            let db = DatabaseManager.getConnection();
            db.query('SELECT value, ip from tech_credentials where techID = ? and type = ? ', [techID, 'local'], function (error, results, fields) {
                if (error) {
                    return done(error);
                }

                if (results.length === 0) {
                    return done(null, -1, "Local credentials not found")
                }

                let credentialJSON = results[0];

                // Verify that the password is correct
                Credentials.verify(credentialJSON.value, password).then(function (isValid: any) {
                    if (isValid) {
                        return done(null, techID);
                    }
                    else {
                        return done(null, -1, "Email and password do not match");
                    }
                });
            });
        });
    }

    public generateAuthToken(techID: number, ip: string, callback: (err: any, token?: string, menuJSON?: string) => void) {

        let manager: TechManager = this;

        require('crypto').randomBytes(32, function(err: string, buffer: any) {

            let tokenExpiry = new Date();
            if (ip == '*') {

                tokenExpiry.setTime(tokenExpiry.getTime() + 3600000);
            }
            else {

                tokenExpiry.setDate(tokenExpiry.getDate() + 7);
            }

            let authToken = {
                "token": buffer.toString('hex'),
                "techID": techID,
                "expires": tokenExpiry,
                "ip": ip
            }

            let db = DatabaseManager.getConnection();
             db.query('INSERT INTO auth_tokens SET ?', authToken, function (error, results, fields) {

                 if (error) {
                     callback(error);
                 }

                 manager.getTechMenu(techID, function(error: string, menuJSON?: string) {
                                      
                     if (error) {
                         callback(error);
                     }

                     callback(null, authToken.token , menuJSON);
                 })
            });
        });
    }

    public validateAuthToken(token: string, ip: string, callback: (err: any, techID?: number, menuJSON?: string) => void) {

        if (token === undefined) {
            callback("Login required.");
            return;
        }

        let manager: TechManager = this;

        let db = DatabaseManager.getConnection();
        db.query('SELECT techID, expires, ip FROM auth_tokens where token = ?', [token], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if ((results.length === 0) || (results[0].expires < Date.now())) {

                callback(null, -1);
                return
            }

            // Eventually we'll want to make this an authenticaion failure but for now just log it
            if (results[0].ip != ip) {
                console.log("Token IP is different from remote IP");
            }

            let techID = results[0].techID;
            manager.getTechMenu(techID, function(error: string, menuJSON?: string) {

                if (error) {

                    callback(error);
                    return;
                }
                
                callback(null, results[0].techID, menuJSON);
            });
        });
    }

    public deleteAuthToken(token: string, callback: (err: any) => void) {

        if (token === undefined) {

            callback(null);
            return;
        }

        let db = DatabaseManager.getConnection();
        db.query('DELETE FROM auth_tokens where token = ?', [token], function (error, results, fields) {
            if (error) {
                callback(error);
            }
            else {
                callback(null);
            }
        });
    }

    private getTechMenu(techID: number, callback: (error: any, menuJSON?: string) => void) {

        let db = DatabaseManager.getConnection();
        db.query('SELECT menu FROM roles r INNER JOIN ' +
                 'tech_profile p on p.role=r.id where p.id = ?', techID, function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if (results.length == 0) {

                callback(null, JSON.stringify({ display: "Login", route: "login" }));
            }
            else {

                callback(null, results[0].menu);
            }
        });
    }
    //*****************************************************************/
}