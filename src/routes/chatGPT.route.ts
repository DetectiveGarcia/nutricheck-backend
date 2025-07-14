import { Router } from "express";
import { chatGPTController } from "../controllers/chatgpt.controller";
import { checkAuth } from "../middleware/middleware";

const chatGPTRouter = Router()

chatGPTRouter.post('/askChatGPT', checkAuth, chatGPTController)

export default chatGPTRouter