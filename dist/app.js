var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const PORT = process.env.PORT || 8000;
const app = express();
// app.use(bodyParser.json());
// console.log(process.env);
// console.log(path.resolve('../.env').replace(/\\/g,'/'))
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
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
    let room;
    const server = app.listen(PORT, () => {
        console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
        console.log(chalk.blueBright(` ⚡⚡⚡connected on port: http://localhost:${PORT}⚡⚡⚡ `));
        console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
    });
    const connectionInstance = new socketConnection(server);
    const io = connectionInstance.getIO();
    // Socket setup
    io.on("connection", (socket) => {
        room = socket.id;
        console.log(chalk.bgWhiteBright("omo person don connect", room));
        socket.on(SOCKET_EVENTS.CREATE_MEET_LINK, (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield createLink(data, socket, room);
        }));
        socket.on(SOCKET_EVENTS.JOIN_MEET, (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield joinMeet(data, socket, room);
        }));
        socket.on(SOCKET_EVENTS.CREATE_FUTURE_MEET_LINK, (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield createFutureLink(data, socket, room);
        }));
        socket.on(SOCKET_EVENTS.LEAVE_MEET, (person) => __awaiter(void 0, void 0, void 0, function* () {
            yield leaveMeet(person, socket, room);
        }));
        socket.on(SOCKET_EVENTS.OFFER, (person) => __awaiter(void 0, void 0, void 0, function* () {
            yield createOffer(person, socket, room);
        }));
        socket.on(SOCKET_EVENTS.ANSWER, (person) => __awaiter(void 0, void 0, void 0, function* () {
            yield createAnswer(person, socket, room);
        }));
        socket.on(SOCKET_EVENTS.READY_FOR_PEERCONNECTION, (data) => __awaiter(void 0, void 0, void 0, function* () {
            socket.broadcast.emit(SOCKET_EVENTS.CLIENTS_READY_FOR_PEERCONNECTION, data);
        }));
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
    .catch((err) => {
    console.log(err);
});
