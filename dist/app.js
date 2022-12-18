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
import express from "express";
import * as mongoose from "mongoose";
import chalk from "chalk";
import socketConnection from "./socket.js";
import { MONGO_DB_URI } from "./utils/constants.js";
import User from "./models/user.js";
import Participant from "./models/participant.js";
import createLink from "./controllers/meetLink.js";
import joinMeet from "./controllers/joinMeet.js";
import createFutureLink from "./controllers/futureMeetLink.js";
const PORT = process.env.PORT || 8000;
const app = express();
// app.use(bodyParser.json());
// console.log(process.env);
// console.log(path.resolve('../.env').replace(/\\/g,'/'))
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.get("/", (req, res, next) => {
    res.status(200).json({
        state: "connected",
        message: "How far,babyyy ,shall we meet?⚡⚡😍😍  ",
    });
});
const init = () => {
    const server = app.listen(PORT, () => {
        console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
        console.log(chalk.blueBright(` ⚡⚡⚡Client connected on port: http://localhost:${PORT}⚡⚡⚡ `));
        console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
    });
    const connectionInstance = new socketConnection(server);
    const io = connectionInstance.getIO();
    // Socket setup
    io.on("connection", (socket) => {
        console.log(chalk.bgWhiteBright("omo person don connect"));
        // socket.emit("connected");
        socket.on("create-meet-link", (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield createLink(data, socket);
        }));
        socket.on("join-meet", (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield joinMeet(data, socket);
        }));
        socket.on("create-future-meet-link", (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield createFutureLink(data, socket);
        }));
        socket.on("leave-meeting", (person) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("see person wey wan leave meeting", person);
            const { creator: { _id: personId }, meetingId, link, } = person;
            const user = yield User.findOne({
                _id: personId,
            });
            // console.log(user, " user to pull from meeting . ");
            // const meet = await Meeting.findOne({
            //   _id:meetingId,
            // })
            const participantInMeet = yield Participant.findOne({
                meetingId,
            }).populate("participants");
            // console.log(participantInMeet,'PM')
            if (participantInMeet) {
                // @ts-ignore
                participantInMeet.participants.pull(personId);
                const participantIn = yield participantInMeet.save();
                console.log(participantIn, "PI");
                if (user) {
                    // @ts-ignore
                    user.meetings.pull(meetingId);
                    const saveU = yield user.save();
                    // console.log(saveU,'SU');
                }
                const data = {
                    meetLink: link,
                    currentMeetId: meetingId,
                    joiners: participantIn.participants,
                };
                // console.log(data, "dat");
                socket.broadcast.emit("update-joiners", data);
            }
            // socket.broadcast.emit("update-joiners", {
            //   meetLink:joinedData.link,
            //   currentMeetId: joinedData.currentMeetingId,
            //   joiners: joinedData.participants.participants,
            // });
        }));
    });
};
// console.log(server)
mongoose
    .connect(MONGO_DB_URI)
    .then(() => {
    console.log(chalk.bgYellow("         "));
    console.log(chalk.bgCyan("Connected to MONGO-DB"));
    console.log(chalk.bgYellow("         "));
    init();
})
    .catch((err) => {
    console.log(err);
});
