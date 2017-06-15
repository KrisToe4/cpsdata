import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Menu,
         MenuItem } from '@server-src/data-classes/menu-model';

import { TechModel,
         TechProfile,
         TechMapEntry } from '@server-src/data-classes/tech-model';
export class Tech extends TechModel {

    public static fromJSON(json: any) {

        let tech = new Tech();
        tech.fromJSON(json);
        return tech;
    }

    menuSubject: BehaviorSubject<Menu>; 
    profileSubject: BehaviorSubject<TechProfile>;
    mapEntrySubject: BehaviorSubject<TechMapEntry>;

    constructor(email?: string)
    {
        super();

        this.profile.email = email;
        this.profileSubject = new BehaviorSubject<TechProfile>(this.profile);

        this.mapEntrySubject = new BehaviorSubject<TechMapEntry>(this.mapEntry);

        this.techMenu.add(new MenuItem("Login", "login"));
        this.menuSubject = new BehaviorSubject<Menu>(this.techMenu);
    }

    /* Observables */
    public getTechMenu(): Observable<Menu> {

        return this.menuSubject.asObservable();
    }

    public getProfileObserver(): Observable<TechProfile> {

        return this.profileSubject.asObservable();
    }

    public getMapEntryObserver(): Observable<TechMapEntry> {

        return this.mapEntrySubject.asObservable();
    }
    /* ************** */

    public storeAuthData(authData: any, callback: (token: string) => void) {

        this.authToken = authData.auth;

        if (authData.menu) {

            this.techMenu.fromJSON(authData.menu)
        }
        else {

            this.techMenu = new Menu([new MenuItem("Login", "login")]);
        }
        this.menuSubject.next(this.techMenu);

        callback(this.authToken);
    }

    public clearAuthData(): boolean {
        this.authToken = "";
        this.profile = new TechProfile();
        this.mapEntry = new TechMapEntry();

        this.techMenu = new Menu([new MenuItem("Login", "login")]);
        this.menuSubject.next(this.techMenu);

        return true;
    }

    public storeProfile(profile: string) {
        this.fromJSON(profile);
        this.profileSubject.next(this.profile);
        this.mapEntrySubject.next(this.mapEntry);
    }
}

export class TechList {
    
    techs: Tech[]

    constructor(list?: any) {

        this.techs = [];

        if (list == undefined) {
            return;
        }

        list.forEach(techJSON => { this.techs.push(Tech.fromJSON(techJSON)); });     
    }
}