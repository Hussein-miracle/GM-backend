var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { customAlphabet } from 'nanoid/async';
// import { nanoid } from "nanoid";
import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { CUSTOM_ALPHABETS, SOCKET_EVENTS } from '../utils/constants.js';
const createLink = (data, socket, room) => __awaiter(void 0, void 0, void 0, function* () {
    const nanoid = customAlphabet(CUSTOM_ALPHABETS, 21);
    console.log(data, "data sent frm fe");
    const creatorName = data.name;
    const settings = data.settings;
    const meetCreator = data.meetCreator;
    const firstPart = yield nanoid(3);
    const secondPart = yield nanoid(4);
    const thirdPart = yield nanoid(3);
    const meetUid = `${firstPart}-${secondPart}-${thirdPart}`;
    // console.log(meetUid,'meetUid')
    const user = new User({
        name: creatorName,
        settings,
        meetCreator,
        meetCreated: meetUid,
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
    const participants = yield Participant.findOne({
        meetingId: savedMeeting._id,
    }).populate('participants');
    // const participants = allParticipants.populate('participants');
    // console.log(participants , 'populate participants')
    const meetingsData = Object.assign(Object.assign({}, savedMeeting._doc), { currentMeetingId: savedMeeting._id, 
        //@ts-ignore 
        participants: Object.assign({}, participants._doc) });
    console.log({ meetingsData }, 'data for FE');
    // don't really understand this line below
    socket.join(meetUid);
    socket.emit(SOCKET_EVENTS.MEET_LINK_CREATED, meetingsData);
});
export default createLink;
