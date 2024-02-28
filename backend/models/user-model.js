import mongoose from "mongoose";

const userCollection= new mongoose.Schema({
    username:{
        type: String,
        trim: true,
    },
    name:{
        type: String,
        trim: true,
    },
    email:{
        type: String,
        trim:true,
    },
    coverImage:{
        type:String,
    },
    profileImage:{
        type:String,
    },
    bio:{
        type:String,
    },
    dob:{
        type:String,
    },
    location:{
        type:String,
    },
    website:{
        type:String,
    },
    verified:{
        type:Boolean,
        default: false,
    },
    expiresAt:{
        type: String,
    },
    subscription:{
        type:String,
        default: 'regular',
    },
    lastPost:{
        type:String,
    },
    numberOfPosts:{
        type:Number,
        default: 0,
    },
    subsExpAt:{
        type: String,
    },
    hidden:{
        type:Boolean,
        default: false
    }
});

export default mongoose.models?.users || mongoose.model("users", userCollection);