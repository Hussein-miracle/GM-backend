import * as dotenv from "dotenv";
dotenv.config();
// import path, { join } from "path";
import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";

import socketConnection from "./socket.js";
import { MONGO_DB_URI } from "./utils/config.js";

import createLink from "./controllers/meetLink.js";
import joinMeet from "./controllers/joinMeet.js";
import leaveMeet from "./controllers/leaveMeet.js";
import createFutureLink from "./controllers/futureMeetLink.js";
import { SOCKET_EVENTS } from "./utils/constants.js";
import createOffer from "./controllers/createOffer.js";
import createAnswer from "./controllers/createAnswer.js";
import { Socket } from "socket.io";


const PORT = process.env.PORT || 8000;

const app = express();

// app.use(bodyParser.json());
// console.log(process.env);
// console.log(path.resolve('../.env').replace(/\\/g,'/'))
app.use(express.urlencoded({ extended: false }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(cors());

app.get("/", (req, res, next) => {
  res.status(200).json({
    state: "connected",
    message: "How far,babyyy ,shall we meet?⚡⚡😍😍  ",
  });
});

const init = () => {
  let room:string;
  const server = app.listen(PORT, () => {
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
    console.log(
      chalk.blueBright(
        ` ⚡⚡⚡connected on port: http://localhost:${PORT}⚡⚡⚡ `
      )
    );
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
  });

  const connectionInstance = new socketConnection(server);
  const io = connectionInstance.getIO();

  // Socket setup

  io.on("connection", (socket: Socket) => {
    room = socket.id;
    console.log(chalk.bgWhiteBright("omo person don connect",room));

    socket.on(SOCKET_EVENTS.CREATE_MEET_LINK, async (data: any) => {
      await createLink(data, socket,room);
    });

    socket.on(SOCKET_EVENTS.JOIN_MEET, async (data: any) => {
      await joinMeet(data, socket,room);
    });

    socket.on(SOCKET_EVENTS.CREATE_FUTURE_MEET_LINK, async (data: any) => {
      await createFutureLink(data, socket,room);
    });

    socket.on(SOCKET_EVENTS.LEAVE_MEET, async (person: any) => {
      await leaveMeet(person,socket,room);
    })


    socket.on(SOCKET_EVENTS.OFFER,async(person:any) => {
      await  createOffer(person,socket,room);
    })

    socket.on(SOCKET_EVENTS.ANSWER,async(person:any)=> {
      await createAnswer(person,socket,room);
    })

    socket.on(SOCKET_EVENTS.READY_FOR_PEERCONNECTION,async (data:any) => {
      socket.broadcast.emit(SOCKET_EVENTS.CLIENTS_READY_FOR_PEERCONNECTION,data);
    })
  });
};

// console.log(server)

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log(chalk.bgGreen(`⚡⚡⚡`));
    console.log(chalk.bgCyan("Connected to MONGO-DB"));
    console.log(chalk.bgBlackBright("⚡⚡⚡"));
    init();
  })
  .catch((err: Error) => {
    console.log(err);
  });
