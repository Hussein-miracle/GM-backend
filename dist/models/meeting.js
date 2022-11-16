import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const meetingSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    link: {
        required: true,
        type: String
    }
});
const meetingModel = model('Meeting', meetingSchema);
export default meetingModel;
