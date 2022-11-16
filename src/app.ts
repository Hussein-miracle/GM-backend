// import dotenv from "dotenv";
// dotenv.config()
import path from "path";
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


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const init = () => {
  const server = app.listen(PORT, () => {
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
    console.log(
      chalk.blueBright(
        `⚡⚡⚡Client connected on port: http://localhost:${PORT}⚡⚡⚡`
      )
    );
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
  });
  const connectionInstance = new socketConnection(server);
  const io = connectionInstance.getIO();

  // Socket setup

  io.on("connection", (socket: any) => {
    console.log(chalk.bgWhiteBright("omo person don connect"));

    socket.emit("connected");

    socket.on(
      "create-meet-link",
      async (data: {
        meetCreator: boolean; name: string; settings: any 
}) => {

  console.log(data , 'data sent frm fe')
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

        const savedUser = await user.save();

        const meet = new Meeting({
          creator: savedUser,
          link: meetUid,
        });

        const savedMeeting = await meet.save();
        user.meetings.push(savedMeeting._id);
        const participant = new Participant({
          meetingId:savedMeeting._id,
        })
        participant.participants.push(user._id);
 
        await participant.save();  
        console.log(savedMeeting , 'data sent to F.E') 
        socket.emit("meet-link-created", savedMeeting);
      }
    );
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
  .catch((err: Error) => {
    console.log(err);
  });
