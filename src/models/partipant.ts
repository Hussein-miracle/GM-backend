import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const partipantSchema = new Schema({
  meetingId:{
    ref:'Meeting',
  },
  participants:[{
    ref:'User'
  }]
});



const participantModel = model('participants',partipantSchema);


