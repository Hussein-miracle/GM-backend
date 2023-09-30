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
import Offer from "../models/offer.js";
let offerCreatorId;
const createOffer = (result, socket, room) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, meeting, sessionDescription } = result;
    const { meetingId, meetingLink } = meeting;
    const offerData = {
        userId,
        sessionDescription,
        meetingId
    };
    console.log(offerData.userId, 'offerDetails');
    console.log(offerData.meetingId, 'offerDetails');
    const offerCreatedExists = yield Offer.findOne({
        creatorId: userId,
        meetingId,
    });
    console.log({ offerCreatedExists });
    console.log(offerData.userId, 'offerData userId');
    console.log(result.meeting, 'offerData meeting');
    // console.log(offerData.sessionDescription.type, 'offerDetails user sessionDes type');
    const participantsToReceiveOffer = yield Participant.findOne({
        meetingId: meeting.meetingId,
    });
    console.log({ participantsToReceiveOffer });
    const participants = participantsToReceiveOffer.participants.filter((id) => id.toString() !== userId);
    console.log({ participants });
    if ((participants.length <= 0)) {
        return;
    }
    let offerReceivers = [];
    console.log({ offerReceivers }, 'offerReceivers before op');
    if (offerCreatedExists) {
        const oldReceivers = offerCreatedExists.offerReceivers;
        console.log({ oldReceivers });
        for (const participant of participants) {
            if (!oldReceivers.includes(participant)) {
                offerReceivers.push(participant);
            }
        }
    }
    else {
        offerReceivers = participants;
    }
    console.log({ offerReceivers }, 'offerReceivers after op');
    const offerCreated = new Offer({
        creatorId: userId,
        meetingId,
        offerReceivers,
    });
    const savedOffer = yield offerCreated.save();
    console.log({ savedOffer });
    const userUpdate = yield User.updateMany({ '_id': { $in: offerReceivers } }, { $push: { 'offers': offerData } });
    console.log(userUpdate, 'user offer crete update');
    socket.broadcast.emit(SOCKET_EVENTS.OFFER_CREATED, offerData);
});
export default createOffer;
