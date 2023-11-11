export class HttpResponse {
    public message: string;
    public data?: any;

    constructor(arg1: any, arg2?: any) {
        if (typeof arg1 === 'string' && arg2) {
            this.message = arg1;
            this.data = arg2;
        } else {
            if (typeof arg1 === 'string') {
                this.message = arg1;
            } else {
                this.message = 'success';
                this.data = arg1;
            }
        }
    }
}
