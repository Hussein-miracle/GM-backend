import * as dotenv from "dotenv";
dotenv.config();
import path, { join } from "path";
import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import chalk from "chalk";
import socketConnection from "./socket.js";
import { nanoid } from "nanoid";
import { MONGO_DB_URI } from "./utils/constants.js";
import Meeting from "./models/meeting.js";
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
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
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
    console.log(
      chalk.blueBright(
        ` ⚡⚡⚡Client connected on port: http://localhost:${PORT}⚡⚡⚡ `
      )
    );
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
  });

  const connectionInstance = new socketConnection(server);
  const io = connectionInstance.getIO();

  // Socket setup

  io.on("connection", (socket: any) => {
    console.log(chalk.bgWhiteBright("omo person don connect"));

    // socket.emit("connected");

    socket.on("create-meet-link", async (data: any) => {
      await createLink(data, socket);
    });

    socket.on("join-meet", async (data: any) => {
      await joinMeet(data, socket);
    });

    socket.on("create-future-meet-link", async (data: any) => {
      await createFutureLink(data, socket);
    });

    socket.on("leave-meeting", async (person: any) => {
      console.log("see person wey wan leave meeting", person);
      const {
        creator: { _id: personId },
        meetingId,
        link,
      } = person;

      const user = await User.findOne({
        _id: personId,
      });

      // console.log(user, " user to pull from meeting . ");

      // const meet = await Meeting.findOne({
      //   _id:meetingId,
      // })

      const participantInMeet = await Participant.findOne({
        meetingId,
      }).populate("participants");

      // console.log(participantInMeet,'PM')

      if (participantInMeet) {
        // @ts-ignore
        participantInMeet.participants.pull(personId);
        const participantIn = await participantInMeet.save();

        console.log(participantIn, "PI");

        if (user) {
          // @ts-ignore
          user.meetings.pull(meetingId);
          const saveU = await user.save();
          // console.log(saveU,'SU');
        }

        const data = {
          meetLink: link,
          currentMeetId: meetingId,
          joiners: participantIn.participants,
        };

        // console.log(data, "dat");
        socket.broadcast.emit("update-joiners",data);

        const del = await User.deleteOne({
          _id:personId,
        });

        console.log(chalk.bgGreen('User leaving meet deleted'))

      }

      // socket.broadcast.emit("update-joiners", {
      //   meetLink:joinedData.link,
      //   currentMeetId: joinedData.currentMeetingId,
      //   joiners: joinedData.participants.participants,
      // });
    });
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
