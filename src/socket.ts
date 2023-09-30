import { Server } from "http";
import * as socketio from "socket.io";

//@ts-ignore
export default class SocketConnection {
  [x: string]: any;
  constructor(server: any) {
    //@ts-ignore
    this.io = new socketio.Server(server, {
      cors: {
        origin:'*',
        // allowedHeaders: ["my-custom-header"],
        // credentials: true, 
        // methods:['get','post'],
        // methods: ["GET", "POST"],
        // credentials: true
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
