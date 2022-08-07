const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;
const app = express();

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

app.use(bodyParser.json());


app.listen(PORT,()=>{
  console.log(`Client connected on port${PORT}`);
})