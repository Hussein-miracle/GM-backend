var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import * as mongoose from "mongoose";
import chalk from "chalk";
import socketConnection from "./socket.js";
import { nanoid } from "nanoid";
import { MONGO_DB_URI } from "./utils/constants.js";
import Meeting from "./models/meeting.js";
import User from "./models/user.js";
import Participant from "./models/participant.js";
const PORT = process.env.PORT || 8000;
const app = express();
// app.use(bodyParser.json());
// console.log(process.env.NODE_ENV) 
// console.log(path.resolve('../.env').replace(/\\/g,'/'))
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.get('/', (req, res, next) => {
    res.status(200).json({
        state: 'connected',
        message: 'How far,babyyy ⚡⚡😍😍  ',
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
        socket.emit("connected");
        socket.on("create-meet-link", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(data, 'data sent frm fe');
            const creatorName = data.name;
            const settings = data.settings;
            const meetCreator = data.meetCreator;
            const meetUid = `${nanoid(3)}-${nanoid(4)}-${nanoid(3)}`.toLowerCase();
            // console.log(meetUid,'meetUid')
            const user = new User({
                name: creatorName,
                settings,
                meetCreator,
            });
            const savedUser = yield user.save();
            const meet = new Meeting({
                creator: savedUser,
                link: meetUid,
            });
            const savedMeeting = yield meet.save();
            user.meetings.push(savedMeeting._id);
            const participant = new Participant({
                meetingId: savedMeeting._id,
            });
            participant.participants.push(user._id);
            yield participant.save();
            //@ts-ignore
            const meetingsData = Object.assign(Object.assign({}, savedMeeting._doc), { currentMeetingId: savedMeeting._id });
            //@ts-ignore
            // savedMeeting.currentMeetingId = savedMeeting._id;
            // console.log(savedMeeting , 'data sent to F.E') 
            socket.emit("meet-link-created", meetingsData);
            ;
            socket.on('leave-meeting', (person) => __awaiter(void 0, void 0, void 0, function* () {
                // console.log('see person wey wan leave meeting',person );
                const { creator: { _id: personId }, meetingId } = person;
                const user = yield User.findOne({
                    _id: personId
                });
                console.log(user, ' user to pull from meeting . ');
                // const meet = await Meeting.findOne({
                //   _id:currentMeetingId,
                // })
                // const participantInMeet = await Participant.findOne({
                //   meetingId:currentMeetingId,
                // })
                // if(participantInMeet){
                //   // @ts-ignore
                //   participantInMeet.participants.pull(personId);
                // }
                // if(user){
                //   // @ts-ignore
                //   user.meetings.pull(personId);          
                // }
            }));
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
