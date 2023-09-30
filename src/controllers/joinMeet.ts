import { nanoid } from "nanoid";
import { Socket } from "socket.io";

import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { SOCKET_EVENTS } from "../utils/constants.js";

const joinMeet = async (result: any,socket:Socket,room:string) => {
  console.log({result});
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
      meetCreated: '',
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

    // don't really understand this line below
    socket.join(meetLink);
    // console.log(joinedData , 'joinedData');
    socket.emit(SOCKET_EVENTS.JOINED_MEET, joinedData);
    
    const updateJoinersData =  {
      meetLink:joinedData.link,
      currentMeetId: joinedData.currentMeetingId,
      joiners: joinedData.participants.participants,
    }
    socket.broadcast.emit(SOCKET_EVENTS.UPDATE_JOINERS,updateJoinersData);


  } else {
    const joinedData = {
      status: 404,
      message: "Link not valid or it's been destroyed by creator",
      meetData: {
        link: meetLink,
      },
    };
    socket.emit(SOCKET_EVENTS.JOINED_MEET, joinedData);
  }
}

export default joinMeet;