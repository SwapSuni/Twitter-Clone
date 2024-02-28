import mongoose from "mongoose";

const postCollection= new mongoose.Schema({
    email:{
        type:String,
    },
    post:{
        type:String,
    },
    profilePhoto:{
        type:String,
    },
    photo:{
        type:String,
    },
    name:{
        type:String,
    },
});

export default mongoose.models?.posts || mongoose.model("posts", postCollection);