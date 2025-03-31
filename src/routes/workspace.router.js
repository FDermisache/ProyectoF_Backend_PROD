import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createWorkspaceController, getWorkspacesByUserController, inviteUserToWorkspaceController } from "../controllers/worskapce.controller.js"
import { get } from "mongoose"



const workspace_router = Router()

workspace_router.post('/', authMiddleware, createWorkspaceController)

// nueva ruta para invitaciones /api/workspace/invite/ id del invitado
workspace_router.post('/:workspace_id/invite/:invited_id',authMiddleware,inviteUserToWorkspaceController) // workspace_id es el id del workspace que lo estoy invitando
workspace_router.get('/my-workspaces', authMiddleware, getWorkspacesByUserController)
export default workspace_router