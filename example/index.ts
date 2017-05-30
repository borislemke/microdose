import {
    MicroRouter,
    MicroMethod,
    MicroResponse,
    MicroRequest,
    MicroBootstrap
} from '../dist'

@MicroRouter()
class ServerApp {

    @MicroMethod.Get('/users')
    helloWorld(req: MicroRequest, res: MicroResponse): void {
        res.send('Hello World')
    }

    @MicroMethod.Post()
    addHello(req: MicroRequest, res: MicroResponse): void {
        console.log('req.headers', req.headers)
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

    @MicroMethod.Delete()
    forgetMeNot(req: MicroRequest, res: MicroResponse): void {
        res.send('Deleted!')
    }
}

MicroBootstrap(ServerApp, 3000, () => {
    console.log('listening')
})
