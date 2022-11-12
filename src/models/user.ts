import { Schema,model } from "mongoose";


const userSchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  email: {
    type: String,
  },
  screen:{
    type:Boolean,
    default:true,
  },
  voice:{
    type:Boolean,
    default:false,
  },
  password: {
    type: String,
  },
  meetings:[
    {
      ref:'Meeting',
    }
  ]
})

const userModel = model('User',userSchema);

export default userModel;