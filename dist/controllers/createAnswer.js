var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { SOCKET_EVENTS } from "../utils/constants.js";
const createAnswer = (result, socket, room) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, meeting, sessionDescription } = result;
    const { meetingId, meetingLink } = meeting;
    const answerData = {
        userId,
        sessionDescription,
        meetingId
    };
    console.log(answerData.userId, 'answerData userId');
    console.log(result.meeting, 'answerData meeting');
    console.log(answerData.sessionDescription.type, 'answerDetails user sessionDes type');
    const participantsToReceiveAnswer = yield Participant.findOne({
        meetingId: meeting.meetingId,
    });
    console.log({ participantsToReceiveAnswer });
    const participants = participantsToReceiveAnswer.participants.filter((id) => id.toString() !== userId);
    console.log({ participants });
    if ((participants.length <= 0)) {
        return;
    }
    // const actualParticipants = await User.find({
    //   '_id':{$in: participants}
    // })
    // console.log({actualParticipants})
    const userUpdate = yield User.updateMany({ '_id': { $in: participants } }, { $push: { 'answers': answerData } });
    console.log(userUpdate, 'user answer crete update');
    socket.broadcast.emit(SOCKET_EVENTS.ANSWER_CREATED, answerData);
});
export default createAnswer;
