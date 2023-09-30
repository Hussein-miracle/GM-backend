import { nanoid } from "nanoid";
import { Socket } from "socket.io";

import Meeting from "../models/meeting.js";
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { SOCKET_EVENTS } from "../utils/constants.js";
import Offer from "../models/offer.js";
import {Types } from "mongoose";



let offerCreatorId:any;

const createOffer = async (result: any, socket: Socket,room?:string) => {
  const { userId, meeting, sessionDescription } = result;

  const {meetingId,meetingLink} = meeting;
  const offerData = {
    userId,
    sessionDescription,
    meetingId
  }
  console.log(offerData.userId,'offerDetails');
  console.log(offerData.meetingId,'offerDetails');

  const offerCreatedExists = await Offer.findOne({
    creatorId:userId,
    meetingId,
  });


  console.log({offerCreatedExists});
  

  console.log(offerData.userId, 'offerData userId');
  console.log(result.meeting, 'offerData meeting');
  // console.log(offerData.sessionDescription.type, 'offerDetails user sessionDes type');

  const participantsToReceiveOffer = await Participant.findOne({
    meetingId: meeting.meetingId,
  })

  console.log({ participantsToReceiveOffer })

  const participants = participantsToReceiveOffer.participants.filter((id) => id.toString() !== userId);

  console.log({ participants })

  if ((participants.length <= 0)) {
    return;
  }


  let offerReceivers:Array<Types.ObjectId> = [];

  console.log({offerReceivers},'offerReceivers before op');
  
  if(offerCreatedExists){
    const oldReceivers = offerCreatedExists.offerReceivers;
    console.log({oldReceivers});
    
    for(const participant of participants){
      if(!oldReceivers.includes(participant)){
        offerReceivers.push(participant)
      }
    }
  }else{
    offerReceivers = participants;
  }
  
  console.log({offerReceivers},'offerReceivers after op');



  const offerCreated =  new Offer({
    creatorId:userId,
    meetingId,
    offerReceivers,
  })

  const savedOffer = await offerCreated.save();

  console.log({savedOffer});


  const userUpdate = await User.updateMany(
    { '_id': { $in: offerReceivers } },
    { $push: { 'offers': offerData } }
  )


  console.log(userUpdate, 'user offer crete update')

  socket.broadcast.emit(SOCKET_EVENTS.OFFER_CREATED, offerData)


  


}


export default createOffer; 