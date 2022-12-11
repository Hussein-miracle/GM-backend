import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";

const createFutureLink =  async (data: { meetCreator: boolean; name: string; settings: any },socket:Socket) => {
  // console.log(data, "data sent frm fe");
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
    meetingId: savedMeeting._id,
  });
  participant.participants.push(user._id);

  await participant.save();
  // const participants = await Participant.findOne({
  //   meetingId:savedMeeting._id,
  // }).populate('participants');
  // // const participants = allParticipants.populate('participants');
  // // console.log(participants , 'populate participants')
  const meetingsData = {
    //@ts-ignore
    ...savedMeeting._doc,
    currentMeetingId: savedMeeting._id,
    _id:undefined,
  };
  //@ts-ignore
  socket.emit("future-meet-link-created", meetingsData);

}

export default createFutureLink;

