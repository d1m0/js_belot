import express from "express"
import {Server as JsonRPCServer} from "jayson"

export class BelotServer {
    public readonly app: any;

    constructor(
        public readonly port: number = 5000,
    ) {
        this.app = express();
        this.mountRoutes();
    }

    mountRoutes(): void {
        // Log all requests for debugging
        this.app.all('*', function (req, res, next) {
            console.log(`Request ${req.originalUrl} in ${process.cwd()}`);
            next() // pass control to the next handler
        })

        const routingTable = {
            getGameState: function(args, cb) {
                if (args.length !== 1 || !(typeof args[0] === "string")) {
                    cb(`Invalid arguments to getGameState: ${JSON.stringify(args)}`, [])
                }
            }
        }

        this.app.use("/api", express.urlencoded(), express.json());
        this.app.post("/api", new JsonRPCServer(routingTable).middleware())
        this.app.get("/*", express.static("/home/dimo/work/consensys/exec-view/dist/static/"))
    }

    start(): void {
        console.log(`Serving on port ${this.port}`)
        this.app.listen(this.port);
    }
}