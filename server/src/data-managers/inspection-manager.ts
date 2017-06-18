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

            console.log(results);

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


    public addInspection(tech: number, json: string, callback: (error: any, inspectionID?: number) => void) {

        console.log("Generating inspection. Details: " + json);
        let inspection = JSON.parse(json);

        console.log("Parsed Object: " + JSON.stringify(inspection));

/*
        let manager: InspectionManager = this;

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
        */

        callback(null, 1);
    }

    //private 
}