import mongoose from 'mongoose';
const { Schema,model } = mongoose;


const meetingSchema = new Schema({
  creator:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uuid: {
    required:true,
    type:String
  }
})


const meetingModel = model('Meeting',meetingSchema);

export default meetingModel;