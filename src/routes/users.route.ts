import { Router } from "express";
import { checkAuth } from "../middleware/middleware";
import { registerUser, loginUser, refreshToken, getMe, getMyProducts } from "../controllers/users.controller";


const userRouter = Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refreshToken", refreshToken);
userRouter.get("/me", checkAuth, getMe);
userRouter.get("/me/products", checkAuth, getMyProducts);

export default userRouter