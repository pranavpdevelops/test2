import express from "express"
import { authmidlle,authorizedrole } from "../middleware/authmiddleware.js"
import { createtask, deletetask, gettask, updatetask } from "../controller/taskcontroller.js"

const route = express.Router()

route.get("/",authmidlle,gettask)
route.post("/",authmidlle,authorizedrole("user"),createtask)
route.put("/:id",authmidlle,authorizedrole("user"),updatetask)
route.delete("/:id",authmidlle,deletetask)

export default route
