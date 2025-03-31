import express from "express";
import { loginController, registerController, resetPasswordController, rewritePasswordController, verifyEmailController } from "../controllers/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/register", registerController)
authRouter.get('/verify-email', verifyEmailController)
authRouter.post('/login', loginController)
authRouter.post('/reset-password', resetPasswordController) // para que llegue el mail para poder cambiar la contrasela
authRouter.put('/rewrite-password', rewritePasswordController) //  cambiar/sobreesxribir la contraseña
export default authRouter