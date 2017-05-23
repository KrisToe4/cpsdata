import { Action,
         ActionList } from './action';

export class TechModel {
    public authToken: string;
    public profile: TechProfile;
    public mapEntry: TechMapEntry; 

    protected authorizedActions: ActionList; 

    constructor()
    {
        this.authToken = "";
        this.profile = new TechProfile();
        this.mapEntry = new TechMapEntry();
        this.authorizedActions = new ActionList();
    }

    public updateFromObject(data: any) {

        let profile = data.profile;
        if (profile) {

            this.profile.email = profile.email;
            this.profile.name = profile.name;
            this.profile.certOrg = profile.certOrg;
            this.profile.certType = profile.certType;
            this.profile.certDate = profile.certDate;
        }

        let mapEntry = data.mapEntry;
        if (mapEntry) {

            this.mapEntry.public = mapEntry.public;
            this.mapEntry.address = mapEntry.address;
            this.mapEntry.province = mapEntry.province;
            this.mapEntry.region = mapEntry.region;
            this.mapEntry.postalCode = mapEntry.postalCode;
            this.mapEntry.geoLat = mapEntry.geoLat;
            this.mapEntry.geoLng = mapEntry.geoLng;
            this.mapEntry.email = mapEntry.email;
            this.mapEntry.phone = mapEntry.phone;
            this.mapEntry.phone2 = mapEntry.phone2;
            this.mapEntry.websiteURL = mapEntry.websiteURL;
            this.mapEntry.websiteName = mapEntry.websiteName;
            this.mapEntry.displayEmail = mapEntry.listEmail;
            this.mapEntry.displayPhone = mapEntry.listPhone;
            this.mapEntry.displayWebsite = mapEntry.listWebsite;
        }
    }

    protected fromJSON(json: any): void {

        console.log(json.email);

        if (json.email) {
            this.profile = new TechProfile(json.email);
            this.profile.name = json.name;
            this.profile.certOrg = json.certOrg;
            this.profile.certType = json.certType;
            this.profile.certDate = json.certDate;
            if (this.profile.certDate && (this.profile.certDate.length > 10))
            {
                this.profile.certDate = this.profile.certDate.substring(0, 10);
            }

        }
        else {
            this.profile = new TechProfile();
        }

        if (json.mapEntry) {
            this.mapEntry.public = (json.mapEntry.public == "true") ? true : false;
            this.mapEntry.address = json.mapEntry.address;
            this.mapEntry.province = json.mapEntry.province;
            this.mapEntry.region = json.mapEntry.region;
            this.mapEntry.postalCode = json.mapEntry.postalCode;
            this.mapEntry.geoLat = Number(json.mapEntry.geoLat);
            this.mapEntry.geoLng = Number(json.mapEntry.geoLng);
            this.mapEntry.email = json.mapEntry.email;
            this.mapEntry.phone = json.mapEntry.phone;
            this.mapEntry.phone2 = json.mapEntry.phone2;
            this.mapEntry.websiteURL = json.mapEntry.websiteURL;
            this.mapEntry.websiteName = json.mapEntry.websiteName;
            this.mapEntry.displayEmail = (json.mapEntry.listEmail == "Y") ? true : false;
            this.mapEntry.displayPhone = (json.mapEntry.listPhone == "Y") ? true : false;
            this.mapEntry.displayWebsite = (json.mapEntry.listWebsite == "Y") ? true : false;
        }
        else {
            this.mapEntry = new TechMapEntry();
        }
    }

    public toJSON(): any {

        // Build all but boolean values
        let json = {
            "email": this.profile.email,
            "name": this.profile.name,
            "certOrg": this.profile.certOrg,
            "certType": this.profile.certType,
            "certDate": this.profile.certDate,
            "mapEntry": {
                "public": "",
                "address": this.mapEntry.address,
                "province": this.mapEntry.province,
                "region": this.mapEntry.region,
                "postalCode": this.mapEntry.postalCode,
                "geoLat": this.mapEntry.geoLat,
                "geoLng": this.mapEntry.geoLng,
                "email": this.mapEntry.email,
                "phone": this.mapEntry.phone,
                "phone2": this.mapEntry.phone2,
                "websiteURL": this.mapEntry.websiteURL,
                "websiteName": this.mapEntry.websiteName,
                "displayEmail": "",
                "displayPhone": "",
                "displayWebsite": ""
            }
        };

        // Now fill those in here
        json["mapEntry"]["public"] = this.mapEntry.public ? "true" : "false";
        json["mapEntry"]["displayEmail"] = this.mapEntry.displayEmail ? "true" : "false";
        json["mapEntry"]["displayPhone"] = this.mapEntry.displayPhone ? "true" : "false";
        json["mapEntry"]["displayWebsite"] = this.mapEntry.displayWebsite ? "true" : "false";

        return json;
    } 
}

export class TechProfile {
    email: string; 
    name: string; 
    certOrg: string; 
    certType: string; 
    certDate: string; // Formatted as "yyyy-MM-dd"

    constructor(email?: string)
    {
        this.email = email && email || "";
        this.name = "";
        this.certOrg = "";
        this.certType = "";
        this.certDate = new Date().toISOString().substring(0, 10);
    }
}

export class TechMapEntry {
    public: boolean; 

    address: string; 
    province: string; 
    region: string; 
    postalCode: string; 
    geoLat: number;
    geoLng: number;
    email: string; 
    phone: string; 
    phone2: string; 
    websiteURL: string; 
    websiteName: string; 
    displayEmail: boolean; 
    displayPhone: boolean; 
    displayWebsite: boolean; 

    constructor() {
        this.public = false;
        this.address = "";
        this.province = "";
        this.region = "";
        this.postalCode = "";
        this.geoLat = 0;
        this.geoLng = 0;
        this.email = "";
        this.phone = "";
        this.phone2 = "";
        this.websiteURL = "";
        this.websiteName = "";
        this.displayEmail = false;
        this.displayPhone = false;
        this.displayWebsite = false;
    }
}

export const TechCertifications = {
    // ** For R&D Purposes Only. This list should be loaded from api ** //
    orgs: ["CPSAC"],
    types: ["CPST", "CPST-I", "CPST-IT"]
}

export class TechCredential {
    type: string
    value: any
    ip: string

    constructor(json: any) {
        
        this.type = json.type;
        this.value = json.value;
        this.ip = json.ip;
    }
}