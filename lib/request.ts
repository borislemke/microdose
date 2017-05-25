import {IncomingMessage} from 'http'


export interface MicroRequest extends IncomingMessage, MicroRequestBuilder {
}


export class MicroRequestBuilder {


    native: IncomingMessage


    body: any = {}


    local: any = {}


    params: any = {}


    constructor(request) {

        this.native = request
    }


    public static create(req: IncomingMessage): MicroRequest {

        const _microRequest = new MicroRequestBuilder(req)

        for (let meth in _microRequest) {
            req[meth] = _microRequest[meth]
        }

        return (req as MicroRequest)
    }
}
