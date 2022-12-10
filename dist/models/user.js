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
    email: {
        type: String,
    },
    settings: {
        screen: {
            type: Boolean,
            default: false,
        },
        voice: {
            type: Boolean,
            default: false,
        },
        cam: {
            type: Boolean,
            default: true,
        },
        caption: {
            type: Boolean,
            default: !true,
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
            sdp: String,
            type: String,
            userId: String,
            meetingId: String,
        },
    ],
    answers: [
        {
            sdp: String,
            type: String,
            userId: String,
            meetingId: String,
        },
    ],
});
const userModel = model("User", userSchema);
export default userModel;
