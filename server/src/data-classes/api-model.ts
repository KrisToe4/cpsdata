export class RequestData {
    route: string;
    data: {};

    constructor(route: any, data?: any) {
        this.route = route;
        this.data = data;
    }
}

export class ResponseData {
    error: string;
    info: string;
    data: {};

    constructor(error: any, info?: string, data?: any) {
        this.error = error;
        this.info = info && info || "";
        this.data = data;
    }
}