import Task from "../model/task.js";

export const gettask = async(req , res)=>{
    try {
        const tasks = req.user.role === "admin"? await Task.find():await Task.find({user_id:req.user.id})
        res.json(tasks)
    } catch (error) {
        console.log("gettask failed")
    }
}

export const createtask = async(req , res)=>{
    try {
       const task = await Task.create({
        ...req.body, user_id:req.user.id
       })
       res.json(task)
    } catch (error) {
        console.log("create failed")
    }
}

export const updatetask = async(req , res)=>{
    try {
       const task = await Task.findOneAndUpdate({
        _id:req.params.id,user_id:req.user.id
       }, req.body,{new : true})
       res.json(task)
    } catch (error) {
        console.log("update failed")
    }
}

export const deletetask = async(req , res)=>{
    try {
        const filter = req.user.role === "admin"? {_id:req.params.id}:{id:req.params.id,user_id:req.user.id}

        await Task.findOneAndDelete(filter)
        res.json({message: "task deleted"})
    } catch (error) {
        console.log("delete failed")
    }
}