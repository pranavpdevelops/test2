import jwt from "jsonwebtoken"

 export const authmidlle = (req , res , next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(404).json({ message:"please login"})
    }
    try {
        req.user = jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(404).json({
            message:"invalid token"
        })
    }
}

 export const authorizedrole = (...role)=>{
    return (req , res, next)=>{
        if(!getRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"access denied"
            })
        }
        next()
    }
}
