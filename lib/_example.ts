import {
    MiddlewareFunction,
    MicroRouter,
    MicroMethod,
    MicroResponse,
    MicroRequest,
    MicroBootstrap
} from '.'
import * as bodyParser from 'body-parser'

const sampleMiddleware: MiddlewareFunction = (req, res, next) => {

    console.log('Test middleware message')

    req.local.user = {name: 'some_user'}

    next(req)
}

@MicroRouter({
    middleware: [sampleMiddleware]
})
class ChildRouter {

    @MicroMethod.Get()
    party(req: MicroRequest, res: MicroResponse): void {

        res.send(req.local.user)
    }

    @MicroMethod.Get('/someone')
    someone(req: MicroRequest, res: MicroResponse): void {
        res.send('someone')
    }
}

@MicroRouter({
    middleware: [bodyParser.json()],
    children: [{prefix: '/party', router: ChildRouter}]
})
class ServerApp {

    @MicroMethod.Get()
    helloWorld(req: MicroRequest, res: MicroResponse): void {
        res.send('Hello World')
    }

    @MicroMethod.Post()// microParser)
    addHello(req: MicroRequest, res: MicroResponse): void {
        res.send(req.body)
    }

    @MicroMethod.Put()
    putToTheTest(req: MicroRequest, res: MicroResponse): void {
        console.log('put')
        res.send(req.body.putty)
    }

    @MicroMethod.Patch()
    eyePath(req: MicroRequest, res: MicroResponse): void {
        console.log('patch')
        res.send(req.body.patch_name)
    }

    @MicroMethod.Delete('/:userName')
    forgetMeNot(req: MicroRequest, res: MicroResponse): void {
        res.send(req.params.userName + ' is forever forgotten')
    }
}

MicroBootstrap(ServerApp, {
    port: 3000,
    cluster: false,
    useSocket: false
})
