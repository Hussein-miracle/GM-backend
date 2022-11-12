import * as socketio from "socket.io";

//@ts-ignore
export default class SocketConnection{
  [x: string]: any;
  constructor(server: any){
    //@ts-ignore
    this.io = new socketio.Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  }
 
  getIO(){
    if (!this.io) { 
      throw new Error('Socket.io not initialized!');
    } 
    return this.io;
  }
}

