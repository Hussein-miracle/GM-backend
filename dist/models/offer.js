import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const offerSchema = new Schema({
    creatorId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    meetingId: {
        ref: 'Meeting',
        type: Schema.Types.ObjectId,
        required: true,
    },
    offerReceivers: [
        {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});
const Offer = model('offer', offerSchema);
export default Offer;
