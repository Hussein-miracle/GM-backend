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
import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { CUSTOM_ALPHABETS } from '../utils/constants.js';
const createFutureLink = (data, socket, room) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(data, "data sent frm fe");
    const nanoid = customAlphabet(CUSTOM_ALPHABETS, 21);
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
    // const participants = await Participant.findOne({
    //   meetingId:savedMeeting._id,
    // }).populate('participants');
    // // const participants = allParticipants.populate('participants');
    // // console.log(participants , 'populate participants')
    const meetingsData = Object.assign(Object.assign({}, savedMeeting._doc), { currentMeetingId: savedMeeting._id, _id: undefined });
    //@ts-ignore
    socket.emit("future-meet-link-created", meetingsData);
});
export default createFutureLink;
