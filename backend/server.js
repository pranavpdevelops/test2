import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/authroutes"
import route from "./routes/taskroutes"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",router)
app.use("/api/tasks",route)

const port = 3000

mongoose.connect(process.env.MONGO_URI).then(()=>{ console.log("db connected")})

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
}).catch((error)=>{ console.log("db not connected")})
