import Channel from "../models/Channel.model.js";
import { ServerError } from "../utils/errors.utils.js";
import workspaceRepository from "./workspace.repository.js";

class ChannelRepository{
    async findChannelById(channel_id){
        return Channel.findById(channel_id).populate('workspace') // le pasamos que queremos expandir , ej: workspace. internamente va ir a la collecion de workspace y se va a traer el registro que coincidca con ese id
        
    }
async createChannel ({name,workspace_id, user_id}){
    // buscamos el workspace a ver si existe
    const workspaceFound = await workspaceRepository.findWorkspaceById(workspace_id)
    if(!workspaceFound){
        throw new ServerError('Workspace not found', 404)
    }

    // verificamos que el usuario pértenezca al workspace
    if(!workspaceFound.members.includes(user_id)){
        throw new ServerError('You are not a member of this workspace', 403)
    }
        const channel = await Channel.create({
            name,
            workspace:workspace_id,
            created_by:user_id})
        return channel
    }

    


}




const channelRepository = new ChannelRepository()
export default channelRepository