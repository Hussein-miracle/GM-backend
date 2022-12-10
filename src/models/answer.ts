import mongoose from 'mongoose';
const { Schema,model } = mongoose;


export const answerSchema = new Schema({
  sdp:{
    type:String,
    required:true,
  },
  type:{
    type:String,
    required:true,
    default:'answer'
  },
  creatorId:{
    required:true,
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  meetingId:{
    ref:'Meeting',
    type:Schema.Types.ObjectId,
  }
})


const answerModel = model('answer',answerSchema);

export default answerModel;