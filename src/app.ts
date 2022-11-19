// import dotenv from "dotenv";
// dotenv.config()
import path from "path";
import express from "express";
import * as mongoose from "mongoose";
import cors from 'cors';
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
app.use(express.urlencoded({extended: false }));

// app.use(cors());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.get('/',(req,res,next) => {
  res.status(200).json({
    state:'connected',
    message:'How far,babyyy ⚡⚡😍😍  ',
  })
})

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
        //@ts-ignore
        const meetingsData = {...savedMeeting._doc,currentMeetingId:savedMeeting._id } ;
        //@ts-ignore
        // savedMeeting.currentMeetingId = savedMeeting._id;
        // console.log(savedMeeting , 'data sent to F.E') 
        socket.emit("meet-link-created", meetingsData   );; 


        socket.on('leave-meeting',async (person: any) => {
          // console.log('see person wey wan leave meeting',person );
          const {creator:{ _id:personId },meetingId} = person;
          const user = await User.findOne({
            _id: personId
          });

          console.log(user, ' user to pull from meeting . ')

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


        })
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
