import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const partipantSchema = new Schema({
    meetingId: {
        ref: 'Meeting',
        type: Schema.Types.ObjectId,
    },
    participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
});
const participantModel = model('participant', partipantSchema);
export default participantModel;
