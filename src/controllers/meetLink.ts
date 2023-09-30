import { customAlphabet } from 'nanoid/async'
import { Socket } from "socket.io";
// import { nanoid } from "nanoid";
import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { MeetData, UserSettings } from "../utils/types/index.js";
import { CUSTOM_ALPHABETS, SOCKET_EVENTS } from '../utils/constants.js';

const createLink = async (data: { meetCreator: boolean; name: string; settings: UserSettings }, socket: Socket,room:string) => {

  const nanoid = customAlphabet(CUSTOM_ALPHABETS, 21);
  console.log(data, "data sent frm fe");
  const creatorName = data.name;
  const settings = data.settings;
  const meetCreator = data.meetCreator;

  const firstPart = await nanoid(3);
  const secondPart = await nanoid(4);
  const thirdPart = await nanoid(3);

  const meetUid = `${firstPart}-${secondPart}-${thirdPart}`;
  // console.log(meetUid,'meetUid')

  const user = new User({
    name: creatorName,
    settings,
    meetCreator,
    meetCreated: meetUid,
  });

  const savedUser = await user.save();

  const meet = new Meeting({
    creator: savedUser,
    link: meetUid,
  });

  const savedMeeting = await meet.save();
  user.meetings.push(savedMeeting._id);

  const participant = new Participant({
    meetingId: savedMeeting._id,
  });

  participant.participants.push(user._id);

  await participant.save();

  const participants = await Participant.findOne({
    meetingId: savedMeeting._id,
  }).populate('participants');
  // const participants = allParticipants.populate('participants');
  // console.log(participants , 'populate participants')
  const meetingsData: MeetData = {
    //@ts-ignore
    ...savedMeeting._doc,
    currentMeetingId: savedMeeting._id,
    //@ts-ignore 
    participants: { ...participants._doc }
  };


  console.log({meetingsData},'data for FE');
  

  // don't really understand this line below
  socket.join(meetUid)

  socket.emit(SOCKET_EVENTS.MEET_LINK_CREATED, meetingsData);

}

export default createLink;