
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        default:" "
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true

    },
},{
    timestamps:true
})

const Task= mongoose.model("task",taskSchema)

export default Task