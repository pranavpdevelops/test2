import User from "../model/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const register = async(req , res)=>{
    try {
        const{name,email,password,role}=req.body
        const hashpassword= await bcrypt.hash(password,10)
        const user = await User.create({
            name,email,password:hashpassword,role:"user"
        })
        res.status(200).json(user)
    } catch (error) {
        console.log("registration failed")
        
    }
}

export const login =async(req , res)=>{
    try {
        const{email,password}=req.body
        const user = await User.findOne({email})

        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(404).json({
                message:"invalid"
            })
        }
        const token = jwt.sign( {id: user._id , role:user.role},process.env.JWT_SECRET)
        res.json({token,role:user.role})
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}