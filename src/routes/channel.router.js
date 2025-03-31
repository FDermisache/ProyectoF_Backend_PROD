import {Router} from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { createChannelController, getChannelByWorkspaceController, getMessageListFromChannelController, sendMEssageToChannelController } from '../controllers/channel.controller.js'


const channelRouter = Router()

// crear canal
// Body: {name:'general'}
// Headers: 'autorization: Bearer token'
// chequear que el usuario quer quiera crear un canal este incluido como miembro 
channelRouter.post('/:workspace_id',authMiddleware,createChannelController)


// enviar mensajes

channelRouter.post('/:channel_id/message',authMiddleware,sendMEssageToChannelController)

channelRouter.get('/:channel_id/message',authMiddleware,getMessageListFromChannelController)
channelRouter.get('/workspace/:workspace_id', authMiddleware, getChannelByWorkspaceController);


export default channelRouter