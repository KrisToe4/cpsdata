export class Menu {
    menuItems: MenuItem[];

    constructor(initialItems?: MenuItem[]) {

        if (initialItems) {
            this.menuItems = initialItems;
        }
        else {
            this.menuItems = [];
        }
    }

    public fromJSON(json: string): void {
        
        let menuObject: any[] = JSON.parse(json) as any[];
        this.fromObject(menuObject);
    }

    public fromObject(menuObject: any[]) {

        this.menuItems = [];

        menuObject.forEach((object: any) => {

            let menuItem = new MenuItem();
            menuItem.fromJSON(object);  
            this.add(menuItem);
        });
    }

    public toJSON(): string {
        return JSON.stringify(this.menuItems);
    }

    public add(item: MenuItem) {

        this.menuItems.push(item);
    }

    public remove(index: number, length?: number) {

        let sliceLen: number = length as number || 1;
        let removedItems: MenuItem[] = this.menuItems.slice(index, sliceLen);
    }

    public replace(newItems: MenuItem[]) {
        this.menuItems = newItems;
    }
}

export class MenuItem {
    display: string;
    route: string;
    action: string;

    subItems: MenuItem[];
    subMenu: Menu;

    constructor(displayValue?: string, route?: string, action?: string) {
        this.display = displayValue as string || "";
        this.route = route as string || "";
        this.action = action as string || "";
    }

    public fromJSON(json: any): void {

        this.display = json.display;
        this.route = json.route;
        this.action = json.action;

        if (json.subMenu) {

            this.subMenu = new Menu();
            this.subMenu.fromObject(json.subMenu);
        }

        if (json.subItems) {

            this.subItems = [];

            let subItemArray: any[] = json.subItems;
            subItemArray.forEach((subItemJSON: any) => {

                let item: MenuItem = new MenuItem();
                item.fromJSON(subItemJSON);
                this.subItems.push(item);
            });
        }
    }
}
