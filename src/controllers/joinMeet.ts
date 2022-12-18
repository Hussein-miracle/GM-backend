import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";

const joinMeet = async (result: any,socket:Socket) => {
  const { name, settings, meetLink } = result;

  const meetNeeded = await Meeting.findOne({
    link: meetLink,
  });

  // console.log(meetNeeded , 'meetNeeded ');

  if (meetNeeded) {
    const joiner = new User({
      name,
      settings,
      meetCreator: false,
    });
    const savedJoiner = await joiner.save();
    const participant = await Participant.findOne({
      meetingId: meetNeeded._id,
    });

    participant.participants.push(savedJoiner._id);

    await participant.save();

    const participants = await Participant.findOne({
      meetingId: meetNeeded._id,
    }).populate("participants");
    // const participants = allParticipants.populate('participants');
    // console.log(participants , 'populate participants')

    const joinedData = {
      status: 200,
      //@ts-ignore
      joiner: { ...savedJoiner._doc  },
      link: meetLink,
      currentMeetingId: meetNeeded._id,
      //@ts-ignore
      meetData: { ...meetNeeded._doc },
      //@ts-ignore
      participants: { ...participants._doc },
    };

    // console.log(joinedData , 'joinedData');
    socket.emit("joined-meet", joinedData);
    
    socket.broadcast.emit("update-joiners", {
      meetLink:joinedData.link,
      currentMeetId: joinedData.currentMeetingId,
      joiners: joinedData.participants.participants,
    });


  } else {
    const joinedData = {
      status: 404,
      message: "Link not valid or it's been destroyed by creator",
      meetData: {
        link: meetLink,
      },
    };
    socket.emit("joined-meet", joinedData);
  }
}

export default joinMeet;