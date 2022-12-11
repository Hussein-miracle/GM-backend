import * as socketio from "socket.io";
//@ts-ignore
export default class SocketConnection {
    constructor(server) {
        //@ts-ignore
        this.io = new socketio.Server(server, {
            cors: {
                origin: ["https://gm-clone-frontend-hussein-miracle.vercel.app", "https://gm-clone-frontend.vercel.app", 'https://gm-clone-frontend-git-shp-hussein-miracle.vercel.app/', '*'],
                // allowedHeaders: ["my-custom-header"],
                // credentials: true, 
                // methods:['get','post']
            },
        });
    }
    getIO() {
        if (!this.io) {
            throw new Error("Socket.io not initialized!");
        }
        return this.io;
    }
}
