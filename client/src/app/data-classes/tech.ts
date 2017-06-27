import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MenuTree,
         Menu,
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

    menuTreeSubject: BehaviorSubject<MenuTree>; 
    profileSubject: BehaviorSubject<TechProfile>;
    mapEntrySubject: BehaviorSubject<TechMapEntry>;

    constructor(email?: string)
    {
        super();

        this.profile.email = email;
        this.profileSubject = new BehaviorSubject<TechProfile>(this.profile);

        this.mapEntrySubject = new BehaviorSubject<TechMapEntry>(this.mapEntry);

        this.techMenu = new MenuTree();
        this.menuTreeSubject = new BehaviorSubject<MenuTree>(this.techMenu);
    }

    /* Observables */
    public getMenuTree(): Observable<MenuTree> {

        return this.menuTreeSubject.asObservable();
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

            this.techMenu = new MenuTree();
        }
        this.menuTreeSubject.next(this.techMenu);

        callback(this.authToken);
    }

    public clearAuthData(): boolean {
        this.authToken = "";
        this.profile = new TechProfile();
        this.mapEntry = new TechMapEntry();

        this.techMenu = new MenuTree();
        this.menuTreeSubject.next(this.techMenu);

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