import mongoose from 'mongoose';
const { Schema,model } = mongoose;


export const offerSchema = new Schema({
  sdp:{
    type:String,
    required:true,
  },
  type:{
    type:String,
    required:true,
    default:'offer'
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


const offerModel = model('offer',offerSchema);

export default offerModel;