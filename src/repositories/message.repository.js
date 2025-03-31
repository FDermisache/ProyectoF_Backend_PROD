import mongoose from "mongoose";
import Message from "../models/Message.model.js";
import { ServerError } from "../utils/errors.utils.js";
import channelRepository from "./channel.repositoy.js";
import workspaceRepository from "./workspace.repository.js";
class MessageRepository {
    async create({ sender, channel_id, content }) {
        const senderObjectId = new mongoose.Types.ObjectId(sender);
        const channelObjectId = new mongoose.Types.ObjectId(channel_id);
    
        // Buscar el canal
        const channel_found = await channelRepository.findChannelById(channel_id);
        if (!channel_found) {
            throw new ServerError('Channel not found', 404);
        }
    
        // Asegurarse de que workspace sea un ObjectId
        const workspaceId = channel_found.workspace._id || channel_found.workspace;
        if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            throw new ServerError('Invalid workspace ID', 400);
        }
    
        // Buscar el workspace
        const workspace_found = await workspaceRepository.findWorkspaceById(workspaceId.toString());
        if (!workspace_found.members.includes(sender)) {
            throw new ServerError('You are not a member of this workspace', 403);
        }
    
        // Crear el mensaje
        const newMessage = await Message.create({
            sender: senderObjectId,
            channel: channelObjectId,
            content,
        });
        return newMessage;
    }
    
    async findMessageFromChannel({channel_id,user_id}){
        const channel_found = await channelRepository.findChannelById(channel_id)
        console.log(channel_found)
        if(!channel_found){
            throw new ServerError('Channel not found', 404)
        }
        if(!channel_found.workspace.members.includes(user_id)){
            throw new ServerError('You are not a member of this workspace', 403)
        }
        const messageList = await Message.find({channel:channel_id}).populate('sender', 'username email')
        return messageList

    }
}

const messageRepository = new MessageRepository()
export default messageRepository