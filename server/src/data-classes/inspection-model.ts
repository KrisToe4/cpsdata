export class Inspection {

    id: number;
    client: Client;
    vehicle: Vehicle;
    restraint: Restraint;
    date: string;
    status: string;

    constructor() { 
        this.client = new Client();
        this.vehicle = new Vehicle();
        this.restraint = new Restraint();
        this.date = new Date().toISOString().substring(0, 10);
    }
}

export class Client {

    name: string;
    email: string;
    phone: string;

    constructor() {

        this.name = "";
        this.email = "";
        this.phone = "";
    }
}

export class Vehicle {

    id: number;
    manufacturer: string;
    model: string;
    year: string;

    constructor() {

        this.manufacturer = "";
        this.model = "";
        this.year = "";
    }
}

export const RestraintType = {
    "i": "Infant",
    "ic": "Infant Convertible",
    "icb": "Infant Convertible Booster",
    "cb": "Convertible Booster",
    "b": "Booster"
}

export class Restraint {

    id: number;
    manufacturer: string;
    model: string;
    subModel: string;
    type: string;

    constructor() {

        this.manufacturer = "";
        this.model = "";
        this.subModel = "";
        this.type = "";
    }
}