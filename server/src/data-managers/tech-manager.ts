import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import * as FacebookStrategy from 'passport-facebook';

const Credentials = require('credentials')();

import { DatabaseManager } from './db-manager';

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

        console.log("Checking for Tech. Email: " + email);

        let db = DatabaseManager.getConnection();
        db.query('SELECT id from tech_profile where email = ?', [email], function (error, results, fields) {
            if (error) {
                callback(error);
            }

            if (results.length > 0) {

                console.log("Found Tech. ID: " + results[0].id);
                callback(null, results[0].id);
            }
            else {

                callback("Tech Not Found.", -1);
            }

        });
    }

    public loadTech(techID: number, callback: (err: any, tech: Tech) => void) {

        console.log("Loading Tech");

        let sqlQuery: string = 'SELECT status, email, name, certOrg, certType, certDate ' +
                               'FROM tech_profile p ' +
                               'LEFT JOIN (tech_certification tc  ' +
                               'INNER JOIN certifications c ON tc.certID = c.id) ON p.id = tc.techID ' +
                               'WHERE p.id = ?' ;

        let db = DatabaseManager.getConnection();
        db.query(sqlQuery, [techID], function (error, results, fields) {
            
            if (error) {
                callback(error, new Tech());
                return;
            }

            if (results.length > 0) {

                let techJSON = results[0];

                console.log('Tech Loaded. ID: ' + techID + ' . Results: ' + JSON.stringify(techJSON));

                db.query('SELECT * from tech_contact where techID = ?', [techID], function (error, mapResults, fields) {
                    if (error) {
                        callback(error, new Tech());
                        return;
                    }

                    // If we have map entry details add them to the JSON object
                    if (mapResults.length > 0) {

                        techJSON.mapEntry = mapResults[0];                    
                    }

                    let tech: Tech = new Tech();
                    tech.storeProfile(techJSON);
                    callback(null, tech);
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

        let sqlQuery: string = 'SELECT name, certType, tcon.* ' +
                               'FROM tech_profile p ' +
                               'INNER JOIN tech_contact tcon on p.id = tcon.techID ' +
                               'INNER JOIN tech_certification tcert on p.id = tcert.techID ' +
                               'INNER JOIN certifications c ON tcert.certID = c.id ' +
                               'WHERE p.status = "active" and tcon.public = "true" AND c.certOrg = ? AND tcert.valid = "true"' ;
        
        console.log(sqlQuery);

        let db = DatabaseManager.getConnection();
        db.query(sqlQuery, [options.org], function (error, results, fields) {

            if (error) {
                callback(error);
                return;
            }

            console.log(results);

            if (results.length > 0) {

                let techList: any = []

                results.forEach((result: any) => {
                    techList.push({
                        name: result.name,
                        certType: result.certType,
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
        console.log("Adding tech. email: " + email);

        let db = DatabaseManager.getConnection();
        db.query('INSERT into tech_profile set ? ', [{ "email": email }], function (error, results, fields) {
            if (error) {
                callback(error);
            }
            else {
                console.log("Registration successful. techID: " + results.insertId);
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

            let cert = { 
                org: techJSON.certOrg, 
                type: techJSON.certType, 
                date: techJSON.certDate 
            };
            manager.updateCertifications(techID, cert, function(error: string, certAdmin: string) {

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
                 'WHERE certOrg = ? and certType = ?',
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

                let certDate = new Date(cert.date);

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
        console.log("Validating login. Email: " + username + " Password: " + password);

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

    public generateAuthToken(techID: number, ip: string, callback: (err: any, token?: string) => void) {

        console.log("Here");

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

            console.log(authToken);

            let db = DatabaseManager.getConnection();
             db.query('INSERT INTO auth_tokens SET ?', authToken, function (error, results, fields) {

                 if (error) {
                     callback(error);
                 }

                 callback(null, authToken.token);
            });
        });
    }

    public validateAuthToken(token: string, ip: string, callback: (err: any, techID?: number) => void) {
        if (token === undefined) {
            callback("Login required.");
            return;
        }

        console.log("Validating AuthToken. Token: " + token);

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

            callback(null, results[0].techID);
        });
    }

    public deleteAuthToken(token: string, callback: (err: any) => void) {
        if (token === undefined) {
            callback(null);
            return;
        }

        console.log("Deleting AuthToken. Token: " + token);

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
    //*****************************************************************/
}