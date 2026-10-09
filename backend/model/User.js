
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"],

    },
    role:{
        type:String,
        enum:["admin","user"],
        required:true,
        default:"user"
    },
},{
    timestamps:true
})

const User = mongoose.model("user",userSchema)

export default User