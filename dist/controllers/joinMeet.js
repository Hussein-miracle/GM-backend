var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";
const joinMeet = (result, socket) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, settings, meetLink } = result;
    const meetNeeded = yield Meeting.findOne({
        link: meetLink,
    });
    // console.log(meetNeeded , 'meetNeeded ');
    if (meetNeeded) {
        const joiner = new User({
            name,
            settings,
            meetCreator: false,
        });
        const savedJoiner = yield joiner.save();
        const participant = yield Participant.findOne({
            meetingId: meetNeeded._id,
        });
        participant.participants.push(savedJoiner._id);
        yield participant.save();
        const participants = yield Participant.findOne({
            meetingId: meetNeeded._id,
        }).populate("participants");
        // const participants = allParticipants.populate('participants');
        // console.log(participants , 'populate participants')
        const joinedData = {
            status: 200,
            //@ts-ignore
            joiner: Object.assign({}, savedJoiner._doc),
            link: meetLink,
            currentMeetingId: meetNeeded._id,
            //@ts-ignore
            meetData: Object.assign({}, meetNeeded._doc),
            //@ts-ignore
            participants: Object.assign({}, participants._doc),
        };
        // console.log(joinedData , 'joinedData');
        socket.emit("joined-meet", joinedData);
        socket.broadcast.emit("update-joiners", {
            joiners: joinedData.participants,
        });
    }
    else {
        const joinedData = {
            status: 404,
            message: "Link not valid or it's been destroyed by creator",
            meetData: {
                link: meetLink,
            },
        };
        socket.emit("joined-meet", joinedData);
    }
});
export default joinMeet;
