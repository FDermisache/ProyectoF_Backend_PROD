import Workspace from "../models/Workspace.model.js";
import { ServerError } from "../utils/errors.utils.js";

class WorkspaceRepository {
    async findWorkspaceById(id) {
        return await Workspace.findById(id)
    }

    
    async createWorkspace({name,owner_id}){  // que necesitamos para crear el workspaces(nombre y owner_id)
        const workspace = await Workspace.create({
            name,
            owner: owner_id,
            members: [owner_id]
        }
    )
    return workspace
    }
    async addNweMember({workspace_id,owner_id,invited_id}){
        const workspaceFound = await this.findWorkspaceById(workspace_id) // llamamos a la funcion que busca el workspace por id y le pasamos por parametro el workspaces
        
        if(!workspaceFound){
            throw new ServerError('Workspace not found', 404)
        }
        if(!workspaceFound.owner.equals(owner_id)){
            throw new ServerError('You are not the owner of this workspace', 403)
        }
        // chequeamos que el invitado ya no sea miembro del workspace
        if(workspaceFound.members.includes(invited_id)){
            throw new ServerError('User already in workspace', 400)
        }
        workspaceFound.members.push(invited_id) // le añadimos el nuevo miembro al workspace
        await workspaceFound.save()
        return workspaceFound
    }

    
}


const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository