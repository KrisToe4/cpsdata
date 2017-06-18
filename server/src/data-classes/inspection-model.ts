export class Inspection {

    id: number;
    client: Client;
    vehicle: Vehicle;
    restraint: Restraint;
    date: Date;
    status: string;
}

export class Client {

    name: string;
    email: string;
    phone: string;
}

export class Vehicle {

    id: number;
    manufacturer: string;
    model: string;
    year: string;
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
}