import { MenuTree,
         Menu,
         MenuItem } from './menu-model';

export class TechModel {
    public authToken: string;
    public id: number;
    public profile: TechProfile;
    public mapEntry: TechMapEntry; 

    protected techMenu: MenuTree; 

    constructor()
    {
        this.authToken = "";
        this.id = 0;
        this.profile = new TechProfile();
        this.mapEntry = new TechMapEntry();
        this.techMenu = new MenuTree();
    }

    public updateFromObject(data: any) {

        let profile = data.profile;
        if (profile) {

            this.profile.email = profile.email;
            this.profile.name = profile.name;

            if (profile.cert) {
                this.profile.cert = profile.cert;
            }
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
            this.mapEntry.displayEmail = mapEntry.displayEmail;
            this.mapEntry.displayPhone = mapEntry.displayPhone;
            this.mapEntry.displayWebsite = mapEntry.displayWebsite;
        }
    }

    protected fromJSON(json: any): void {

        this.id = json.id;
        
        this.profile = new TechProfile(json.email);
        this.profile.name = json.name;
        
        if (json.cert) {
            let certValid = (json.cert.valid == "true") ? true : false;
            this.profile.cert = new TechCertification(json.cert.org, json.cert.type, json.cert.certDate, certValid)
        }
        else {
            this.profile.cert = new TechCertification();
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
            this.mapEntry.displayEmail = (json.mapEntry.displayEmail == "true") ? true : false;
            this.mapEntry.displayPhone = (json.mapEntry.displayPhone == "true") ? true : false;
            this.mapEntry.displayWebsite = (json.mapEntry.displayWebsite == "true") ? true : false;
        }
        else {
            this.mapEntry = new TechMapEntry();
        }
    }

    public toJSON(): any {

        // Build all but boolean values
        let json = {
            "id": this.id,
            "email": this.profile.email,
            "name": this.profile.name,
            "cert": {
                "org": this.profile.cert.org,
                "type": this.profile.cert.type,
                "certDate": this.profile.cert.certDate
            },
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
        json["cert"]["valid"] = this.profile.cert.valid ? "true" : "false";
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
    cert: TechCertification;

    constructor(email?: string)
    {
        this.email = email && email || "";
        this.name = "";
        this.cert = new TechCertification();
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

export const TechCertTypes = {
    // ** For R&D Purposes Only. This list should be loaded from api ** //
    orgs: ["*None", "CPSAC"],
    types: ["*None", "CPST", "CPST-I", "CPST-IT"]
}

export class TechCertification {
    org: string; 
    type: string; 
    certDate: string; // Formatted as "yyyy-MM-dd"
    valid: boolean;

    constructor(org?: string, type?: string, certDate?: string, valid?: boolean)
    {
        this.org = org && org || TechCertTypes.orgs[0];
        this.type = type && type || TechCertTypes.types[0];

        this.certDate = certDate && certDate || new Date().toISOString().substring(0, 10);
        if (this.certDate.length > 10)
        {
            this.certDate = this.certDate.substring(0, 10);
        }

        this.valid = valid && valid || false;
    }
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