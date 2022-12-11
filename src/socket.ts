import * as socketio from "socket.io";

//@ts-ignore
export default class SocketConnection {
  [x: string]: any;
  constructor(server: any) {
    //@ts-ignore
    this.io = new socketio.Server(server, {
      cors: {
        origin: ["https://gm-clone-frontend-hussein-miracle.vercel.app", "https://gm-clone-frontend.vercel.app",'https://gm-clone-frontend-git-shp-hussein-miracle.vercel.app/','http://localhost:3000' ],
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
