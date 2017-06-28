import { DatabaseManager } from './db-manager';
import { TechManager } from './tech-manager';

import { Inspection } from '../data-classes/inspection-model';

import { Tech } from '../data-classes/tech';
import { TechCredential,
         TechProfile } from '../data-classes/tech-model';

/**
 * Constructor
 *
 * @class InspectionManager
 */
export class InspectionManager {

    private static manager: InspectionManager;

    public static Manager(): InspectionManager {
        if (this.manager == null) {
            this.manager = new InspectionManager();
        }
        return this.manager;
    }

    /**
     * Constructor
     *
     * @class InspectionManager
     * @constructor
     */
    constructor() {}


    public getList(options: any, callback: (error: any, list?: any) => void) {

        /* Current options structure:
        { techID: number }

        Planned structure :
        { techID?: number, org?: string, vehicle?: Vehicle, restraint?: Restraint }
        These first two are probably in practice a binary toggle
        - by tech (Done) - This option is the default
        - by org - This option would be for admins to view inspections from multiple techs
        These are meant for list filtering 
        - by vehicle
        - by restraint
        */

        let sqlQuery: string = 'SELECT i.id, c.name as client, ' +
                                    'vm.name as v_manufacturer, v.model as v_model, v.year, ' +
                                    'rm.name as r_manufacturer, r.model as r_model, ' +
                                    'date, ti.status ' +
                               'FROM inspections i ' +                 
                                    'INNER JOIN clients c on i.client = c.id ' +
                                    'INNER JOIN vehicles v ON i.vehicle = v.id ' +
                                    'INNER JOIN vehicle_manufacturer vm ON v.manufacturer = vm.id ' +
                                    'INNER JOIN restraints r ON i.restraint = r.id ' +
                                    'INNER JOIN restraint_manufacturer rm ON r.manufacturer = rm.id ' +
                                    'INNER JOIN tech_inspections ti on i.id = ti.inspection ' +
                               'WHERE ti.tech = ? AND ti.ownership = "primary"' ;

        let db = DatabaseManager.getConnection();
        db.query(sqlQuery, [options.techID], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if (results.length > 0) {

                let inspectionList: any = []

                results.forEach((result: any) => {
                    inspectionList.push({
                        id: result.id,
                        client: { name: result.client },
                        vehicle: { 
                            manufacturer: result.v_manufacturer,
                            model: result.v_model,
                            year: result.year
                        },
                        restraint: {
                            manufacturer: result.r_manufacturer,
                            model: result.r_model
                        },
                        date: result.date,
                        status: result.status
                    });
                });

                callback(null, inspectionList);
                
            }
            else {
                callback("No Inspections Found.");
            }
        });
    }

    public getInspection(options: any, callback: (error: any, inspection?: any) => void) {

        let sqlQuery: string = 'SELECT i.id, c.name as client, ' +
                                    'vm.name as v_manufacturer, v.model as v_model, v.year, ' +
                                    'rm.name as r_manufacturer, r.model as r_model, ' +
                                    'date, ti.status ' +
                               'FROM inspections i ' +                 
                                    'INNER JOIN clients c on i.client = c.id ' +
                                    'INNER JOIN vehicles v ON i.vehicle = v.id ' +
                                    'INNER JOIN vehicle_manufacturer vm ON v.manufacturer = vm.id ' +
                                    'INNER JOIN restraints r ON i.restraint = r.id ' +
                                    'INNER JOIN restraint_manufacturer rm ON r.manufacturer = rm.id ' +
                                    'INNER JOIN tech_inspections ti on i.id = ti.inspection ' +
                               'WHERE i.id = ? AND ti.tech = ? AND ti.ownership = "primary"' ;

        let db = DatabaseManager.getConnection();
        db.query(sqlQuery, [options.id, options.tech], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if (results.length > 0) {

                let inspection: any = {
                    id: results[0].id,
                    client: { name: results[0].client },
                    vehicle: { 
                        manufacturer: results[0].v_manufacturer,
                        model: results[0].v_model,
                        year: results[0].year
                    },
                    restraint: {
                        manufacturer: results[0].r_manufacturer,
                        model: results[0].r_model
                    },
                    date: results[0].date,
                    status: results[0].status
                }

                callback(null, inspection);
                
            }
            else {
                callback("No Inspection Found.");
            }
        });
    }

    public addInspection(tech: number, data: any, callback: (error: any, inspectionID?: number) => void) {

        console.log(data);

        // Currently don't store the location
        if (data.location) {
            delete(data.location);
        }

        // If we don't have a client just error out. It's the only actual required piece of info
        if (data.client == undefined) {

            callback("Client information is missing");
            return;
        }

        let manager: InspectionManager = this;
        manager.addClient(data.client, function(error: string, clientID: number) {

            if (error) {

                callback(error);
                return;
            }

            manager.addVehicle(data.vehicle, function(error: string, vehicleID: number) {

                if (error) {

                    callback(error);
                    return;
                }

                manager.addRestraint(data.restraint, function(error: string, restraintID: number) {

                    if (error) {

                        callback(error);
                        return;
                    }

                    let inspectionInfo = {
                         client: clientID,
                         vehicle: vehicleID,
                         restraint: restraintID,
                         date: data.date
                     };
                    manager.generateInspection(tech, inspectionInfo, function(error: string, inspectionID: number) {

                        if (error) {
                            
                            callback(error);
                        }
                        else {

                            callback(null, inspectionID);
                        }
                    });
                });
            });
        });
    }

    // If we were passed an id, just return immediately. Otherwise we'll check for a 
    // matching email (if one was provided) and after that just generate a new client record
    private addClient(info: any, callback: (error: any, clientID?: number) => void) {

        // Sanity checks
        if (info.id > 0) {

            callback(null, info.id);
            return;
        }

        if (info.name == undefined) {

            callback("Client name is required");
            return;
        }
        // *****

        if (info.email == undefined) {

            info.email = "*BLANK";
        }

        let db = DatabaseManager.getConnection();
        db.query('SELECT id from clients where email = ? ', [info.email], function (error, results, fields) {
            
            if (error) {

                callback(error);
                return;
            }

            if (results.length > 0) {

                callback(null, results[0].id)
                return;
            }

            db.query('INSERT INTO clients set ?', [info], function (error, results, fields) {
                        
                if (error) {

                    console.log(error);
                    callback(error);
                }
                else {

                    callback(null, results.insertId);
                }
            });   
        });
    }

    private addVehicle(info: any, callback: (error: any, vehicleID?: number) => void) {

        let manager: InspectionManager = this;

        // Sanity checks
        if (info.id > 0) {

            callback(null, info.id);
            return;
        }

        if ((info.manufacturer == undefined) || 
            (info.model == undefined) ||
            (info.year == undefined)) {

            callback("Vehicle information incomplete");
            return;
        }
        // *****

        let db = DatabaseManager.getConnection();
        db.query('SELECT id from vehicle_manufacturer where name = ? ', [info.manufacturer], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            if (results.length == 0) {

                db.query('INSERT INTO vehicle_manufacturer set ? ', [{ name: info.manufacturer }], function (error, results, fields) {

                    if (error) {

                        callback(error);
                    }
                    else {

                        manager.addVehicle(info, callback);
                    }
                });
            }
            else {

                let queryParms = [
                    results[0].id,
                    info.model,
                    info.year
                ];
                db.query('SELECT id from vehicles where manufacturer = ? AND model = ? AND year = ? ', queryParms, function (error, results, fields) {

                    if (error) {

                        callback(error);
                        return;
                    }

                     if (results.length > 0) {

                        callback(null, results[0].id)
                        return;
                     }

                     let vehicleInfo = {
                         manufacturer: queryParms[0],
                         model: queryParms[1],
                         year: queryParms[2],
                         added: new Date().toISOString().substring(0, 10)
                     };
                     db.query('INSERT INTO vehicles set ? ', [vehicleInfo], function (error, results, fields) {
            
                        if (error) {

                            callback(error);
                            return;
                        }

                        if (results.length > 0) {
                        
                            callback(null, results.insertId)
                            return;
                        }
                    });
                });
            }
        });
    }

    private addRestraint(info: any, callback: (error: any, restraintID?: number) => void) {

        let manager: InspectionManager = this;

        // Sanity checks
        if (info.id > 0) {

            callback(null, info.id);
            return;
        }

        if ((info.manufacturer == undefined) || 
            (info.model == undefined)) {

            callback("Restraint information incomplete");
            return;
        }
        // *****

        let db = DatabaseManager.getConnection();
        db.query('SELECT id from restraint_manufacturer where name = ? ', [info.manufacturer], function (error, results, fields) {
            
            if (error) {

                callback(error);
                return;
            }

            if (results.length == 0) {

                db.query('INSERT INTO restraint_manufacturer set ? ', [{ name: info.manufacturer }], function (error, results, fields) {

                    if (error) {

                        callback(error);
                    }
                    else {

                        manager.addRestraint(info, callback);
                    }
                });
            }
            else {

                let queryParms = [
                    results[0].id,
                    info.model
                ];
                db.query('SELECT id from restraints where manufacturer = ? AND model = ? ', queryParms, function (error, results, fields) {

                    if (error) {

                        callback(error);
                        return;
                    }

                     if (results.length > 0) {

                        callback(null, results[0].id)
                        return;
                     }

                     let restraintInfo = {
                         manufacturer: queryParms[0],
                         model: queryParms[1],
                         added: new Date().toISOString().substring(0, 10)
                     };
                     db.query('INSERT INTO restraints set ? ', [restraintInfo], function (error, results, fields) {
            
                        if (error) {

                            callback(error);
                            return;
                        }

                        if (results.length > 0) {
                        
                            callback(null, results.insertId)
                            return;
                        }
                    });
                });
            }
        });
    }

    private generateInspection(tech: number, info: any, callback: (error: any, inspectionID?: number) => void) {

        console.log (info);

        let db = DatabaseManager.getConnection();
        db.query('INSERT into inspections set ? ', [info], function (error, results, fields) {

            if (error) {

                callback(error);
                return;
            }

            let inspectionId: number = results.insertId;

            db.query('INSERT into tech_inspections set ? ', [{ tech: tech, inspection: inspectionId }], function (error, results, fields) {

                if (error) {

                    callback(error);
                    return;
                }

                console.log("Inspection generated. Assigned to tech: " + tech);

                callback(null, inspectionId);
            });
        });
    }
}