var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import User from "../models/user.js";
import Participant from "../models/participant.js";
const leaveMeet = (person, socket, room) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("see person wey wan leave meeting", person);
    const { creator: { _id: personId }, meetingId, link, } = person;
    const user = yield User.findOne({
        _id: personId,
    });
    // console.log(user, " user to pull from meeting . ");
    // const meet = await Meeting.findOne({
    //   _id:meetingId,
    // })
    const participantInMeet = yield Participant.findOne({
        meetingId,
    }).populate("participants");
    // console.log(participantInMeet,'PM')
    if (participantInMeet) {
        // @ts-ignore
        participantInMeet.participants.pull(personId);
        const participantIn = yield participantInMeet.save();
        console.log(participantIn, "PI");
        if (user) {
            // @ts-ignore
            user.meetings.pull(meetingId);
            const saveU = yield user.save();
            // console.log(saveU,'SU');
        }
        const data = {
            meetLink: link,
            currentMeetId: meetingId,
            joiners: participantIn.participants,
        };
        // console.log(data, "dat");
        socket.broadcast.emit("update-joiners", data);
        const del = yield User.deleteOne({
            _id: personId,
        });
        console.log(chalk.bgGreen('User leaving meet deleted', person));
    }
});
export default leaveMeet;
