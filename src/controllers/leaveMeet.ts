import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import chalk from "chalk";

import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";

const leaveMeet = async (person: any,socket:Socket) => {
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
}


export default leaveMeet;