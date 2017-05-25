import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import * as FacebookStrategy from 'passport-facebook';

const Credentials = require('credentials')();

import { DatabaseManager } from './db-manager';

import { Tech } from '../data-classes/tech';
import { TechCredential } from '../data-classes/tech-model';


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

    public addTech(email: string, callback: (err: any, techID?: number) => void) {
        console.log("Adding tech. email: " + email);

        let db = DatabaseManager.getConnection();
        db.query('INSERT into tech_profile set ? ', [{"email": email}], function (error, results, fields) {
            if (error) {
                callback(error);
            }
            else {      
                console.log("Registration successful. techID: " + results.insertId);
                callback(null, results.insertId);
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
        db.query(sqlQuery, [techID], function (error, techResults, fields) {
            if (error) {
                callback(error, new Tech());
                return;
            }

            if (techResults.length > 0) {

                let techJSON = techResults[0];

                console.log('Tech Loaded. ID: ' + techID + ' . Results: ' + JSON.stringify(techJSON));

                db.query('SELECT * from tech_contact where techID = ?', [techID], function (error, mapResults, fields) {
                    if (error) {
                        callback(error, new Tech());
                        return;
                    }

                    console.log(mapResults);

                    // If we have map entry details add them to the JSON object
                    if (mapResults) {
                        console.log("Found tech map entry. Results: " + JSON.stringify(mapResults[0]));

                        techJSON.mapEntry = mapResults[0];      

                        console.log("Completed Tech: " + JSON.stringify(techJSON));                  
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

    public updateTech(techID: number, techJSON: any, callback: (err: any) => void) {
        console.log("Updating tech. ID: " + techID);

        // For now we are not going to allow updates to the registered email and we're 
        // doing this in parts instead of one complicated UPDATE (which might come later)
        let db = DatabaseManager.getConnection();
        db.query('UPDATE tech_profile set name = ? where id = ?', [techJSON.name, techID], function (error, results, fields) {
            if (error) {
                callback(error);
            }
            else {
                // Check if this tech already has the indicated certification. IF it does update the certDate otherwise insert
                db.query('SELECT id, techID FROM ' +
                         'certifications c LEFT JOIN tech_certification tc ON c.id = tc.certID ' +
                         'WHERE c.certOrg = ? and c.certType = ?',
                    [techJSON.certOrg, techJSON.certType], function (error, results, fields) {

                        if (error) {

                            callback(error);
                            return;
                        }

                        if (results.length == 0) {

                            callback("Certification Not Found");
                            return;
                        }

                        let certSQL: string;
                        let sqlFields = [];
                        if (results[0].techID) {

                            certSQL = 'UPDATE tech_certification set ? where techID = ?';
                            sqlFields = [{ certDate: new Date(techJSON.certDate) }, techID];
                        }
                        else {

                            certSQL = 'INSERT INTO tech_certification set ?';
                            sqlFields = [{ techID: techID, certID: results[0].id, certDate: new Date(techJSON.certDate) }];
                        }
                        

                        db.query(certSQL, sqlFields, function (error, results, fields) {
                            if (error) {

                                callback(error);
                                return;
                            }

                            db.query('SELECT id FROM tech_contact WHERE techID = ?', [techID], function (error, results, fields) {

                                    if (error) {

                                        callback(error);
                                        return;
                                    }

                                    let mapJSON = techJSON.mapEntry;

                                    let mapSQL: string;
                                    let sqlFields = [];
                                    if (results.length == 0) {

                                        mapJSON['techID'] = techID;
                                        mapSQL = 'INSERT INTO tech_contact set ?';
                                        sqlFields = [mapJSON];
                                    }
                                    else {

                                        mapSQL = 'UPDATE tech_contact set ? where techID = ?';
                                        sqlFields = [mapJSON, techID];
                                    }

                                    console.log(mapSQL);
                                    console.log(sqlFields);

                                    db.query(mapSQL, sqlFields, function (error, results, fields) {
                                        if (error) {

                                            callback(error);
                                        }
                                        else {

                                            callback(null);
                                        }
                                    });
                                });
                        });
                    });
            }
        });
    }

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