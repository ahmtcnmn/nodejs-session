import express from "express";
import {
    getLoginController,
    postLoginController,
    logaout,
    getRegisterController,
    postRegisterContoller
    } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import {isCheckRegister} from "../validations/register-validation.js"
const router = express.Router();



router.get("/",(req,res) => {
    res.render('index', {
        title: "Welcome to Again",
        p1:"Welcome "
    })
})

router.get("/login",authMiddleware,getLoginController)
router.post("/login",authMiddleware,postLoginController)
router.get("/logout",logaout)
router.get("/register",authMiddleware,getRegisterController)
router.post("/register",authMiddleware,isCheckRegister(),postRegisterContoller)



export default router