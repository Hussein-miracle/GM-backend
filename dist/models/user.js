import { Schema, model } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
    },
    meetCreator: {
        type: Boolean,
        default: false,
    },
    meetCreated: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
    },
    settings: {
        share_screen: {
            type: Boolean,
            default: false,
        },
        play_voice: {
            type: Boolean,
            default: false,
        },
        show_cam: {
            type: Boolean,
            default: true,
        },
        show_caption: {
            type: Boolean,
            default: false,
        },
    },
    password: {
        type: String,
    },
    meetings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Meeting",
        },
    ],
    offers: [
        {
            sessionDescription: {
                sdp: { type: Schema.Types.Mixed },
                type: { type: String }
            },
            userId: { type: String },
            meetingId: { type: String },
        },
    ],
    offerCandidates: [],
    answers: [
        {
            sessionDescription: {
                sdp: { type: Schema.Types.Mixed },
                type: { type: String }
            },
            userId: { type: String },
            meetingId: { type: String },
        },
    ],
    answerCandidates: [],
    peerConnection: {
        type: Schema.Types.Mixed
    }
});
const userModel = model("User", userSchema);
export default userModel;
