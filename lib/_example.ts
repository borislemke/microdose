import {
    MicroRouter,
    MicroMethod,
    MicroResponse,
    MicroRequest,
    MicroBootstrap
} from '.'

@MicroRouter()
class ServerApp {

    @MicroMethod.Get('/users')
    helloWorld(req: MicroRequest, res: MicroResponse): void {
        res.send('Hello World')
    }

    @MicroMethod.Post()
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

    @MicroMethod.Delete()
    forgetMeNot(req: MicroRequest, res: MicroResponse): void {
        res.send('Deleted!')
    }
}

MicroBootstrap(ServerApp, {
    port: 3000,
    turboMode: true
})
