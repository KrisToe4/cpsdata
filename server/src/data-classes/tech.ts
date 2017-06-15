import { Menu,
         MenuItem } from './menu-model';

import { TechModel,
         TechProfile,
         TechMapEntry } from './tech-model';
export class Tech extends TechModel {

    constructor(email?: string)
    {
        super();

        if (email) {
            this.profile.email = email;
        }
    }

    public storeProfile(profile: string) {
        this.fromJSON(profile);
    }
}