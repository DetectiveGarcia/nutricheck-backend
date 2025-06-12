import { Router } from "express";
import { registerUser } from "controllers/users.controller";

const userRouter = Router();


userRouter.post("/register", registerUser);