export class MenuTree {

    private tree: Menu[] = [];
    private reverseTree: Menu[] = [];

    constructor(rootMenu?: Menu) {

        if (rootMenu) {

            this.tree.push(rootMenu);
        }
        else {

            this.tree.push(new Menu("*", "/tech/", [new MenuItem("Login", "login")]));
        }
    }

    public fromJSON(json: string): void {

       this.tree = []; 
       this.reverseTree = [];

       let list: any[] = JSON.parse(json);

       list.forEach(menuObject => {
           
           let menu: Menu = new Menu().fromObject(menuObject);
           this.tree.push(menu);
           this.reverseTree.unshift(menu);

           console.log(menu);
       });
    }

    public getMenu(index: number): Menu {

        return this.tree[index];
    }

    public search(url: string): Menu {

        let result: Menu;

        // This is offset by 1 so we include the slash in our substrings
        let lastSlash: number = url.lastIndexOf('/') + 1;

        let relativeTo: string = url.substring(0, lastSlash);
        let route: string = url.substring(lastSlash);

        console.log("relativeTo: " + relativeTo + " - route: " + route);
   
        this.reverseTree.forEach(menu => {

            if (result == undefined) {
            
                if ((menu.relativeTo == relativeTo) && (menu.route == route)) {

                    result = menu;
                    console.log("Found Exact Match!");

                }
                else if ((menu.relativeTo == relativeTo) && (menu.route == '*')) {

                    result = menu;
                    console.log("Found Wildcard Match!");
                }
            }
        });


        if (result == undefined) {

            result = this.getMenu(0);
        }
        return result;
    }
}

export class Menu {

    route: string;
    relativeTo: string;
    menuItems: MenuItem[];

    constructor(route?: string, relativeTo?: string, initialItems?: MenuItem[]) {

        this.route = route as string || "*";
        this.relativeTo = relativeTo as string || "/";
        this.menuItems = initialItems as MenuItem[] || [];
    }

    public fromObject(menuObject: any): Menu {

        this.route = menuObject.route;
        this.relativeTo = menuObject.relativeTo;

        this.menuItems = [];
        menuObject.menuItems.forEach((object: any) => {

            let menuItem = new MenuItem();
            menuItem.fromObject(object);  
            this.add(menuItem);
        });

        return this;
    }

    public getRoute(): string {

        if (this.route == "*") {

            return this.relativeTo;
        }
        else {
            
            return this.relativeTo + this.route;
        }
    }

    public add(item: MenuItem) {

        this.menuItems.push(item);
    }

    public append(menu: Menu) {

        this.menuItems = this.menuItems.concat(menu.menuItems);
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

    constructor(displayValue?: string, route?: string, action?: string) {
        this.display = displayValue as string || "";
        this.route = route as string || "";
        this.action = action as string || "";
    }

    public fromObject(json: any): void {

        this.display = json.display as string || "";
        this.route = json.route as string || "";
        this.action = json.action as string || "";

        if (json.subItems) {

            this.subItems = [];

            let subItemArray: any[] = json.subItems;
            subItemArray.forEach((subItemJSON: any) => {

                let item: MenuItem = new MenuItem();
                item.fromObject(subItemJSON);

                // If we weren't given a route assume the action is also the route appended to the current menu items route
                // Otherwise we need to offset the passed route by the menuItem's route to get to the right place
                if (item.route == "") {

                    item.route = this.route + "/" + item.action;
                }
                else {
                    item.route = this.route + "/" + item.route;
                }

                this.subItems.push(item);
            });
        }
    }
}
