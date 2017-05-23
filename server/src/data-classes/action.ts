export class ActionList {
    authorizedActions: Action[];

    constructor(defaults?: boolean, initialActions?: Action[]) {

        if (defaults) {
            this.setDefaultActions();
        }
        else {
            if (initialActions) {
                this.authorizedActions = initialActions;
            }
            else {
                this.authorizedActions = [];
            }
        }
    }

    public fromJSON(json: string) {
        let authList: Action[] = JSON.parse(json) as Action[];

        this.authorizedActions = authList;
    }

    public toJSON(): string {
        return JSON.stringify(this.authorizedActions);
    }

    public add(action: Action) {

        this.authorizedActions.push(action);
    }

    public remove(index: number, length?: number) {

        let sliceLen: number = length as number || 1;
        let removedActions: Action[] = this.authorizedActions.slice(index, sliceLen);
    }

    public replace(newActions: Action[]) {
        this.authorizedActions = newActions;
    }

    // This is for R&D Only
    private setDefaultActions() {
        this.authorizedActions = [
            new Action("Profile", "profile"),
            new Action("Logout", "logout")
        ];
    }
}

export class Action {
    name: string;
    route: string;

    constructor(Name: string, Route: string) {
        this.name = Name;
        this.route = Route;
    }
}
