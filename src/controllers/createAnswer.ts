import { Socket } from "socket.io";
import User from "../models/user.js";
import Participant from "../models/participant.js";
import { SOCKET_EVENTS } from "../utils/constants.js";



const createAnswer = async (result: any, socket: Socket,room?:string) => {
  const { userId, meeting, sessionDescription } = result;
  const {meetingId,meetingLink} = meeting;
  const answerData = {
    userId,
    sessionDescription,
    meetingId
  }



  console.log(answerData.userId, 'answerData userId');
  console.log(result.meeting, 'answerData meeting');
  console.log(answerData.sessionDescription.type, 'answerDetails user sessionDes type');



  
  const participantsToReceiveAnswer = await Participant.findOne({
    meetingId: meeting.meetingId,
  })

  console.log({ participantsToReceiveAnswer })

  const participants = participantsToReceiveAnswer.participants.filter((id) => id.toString() !== userId);

  console.log({ participants })


  
  if ((participants.length <= 0)) {
    return;
  }


  
  // const actualParticipants = await User.find({
  //   '_id':{$in: participants}
  // })

  // console.log({actualParticipants})
  
  const userUpdate = await User.updateMany(
    { '_id': { $in: participants } },
    { $push: { 'answers': answerData } }
  )

  console.log(userUpdate, 'user answer crete update')  
  socket.broadcast.emit(SOCKET_EVENTS.ANSWER_CREATED, answerData)
}


export default createAnswer;