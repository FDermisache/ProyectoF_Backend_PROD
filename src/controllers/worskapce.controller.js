import Workspace from "../models/Workspace.model.js";
import workspaceRepository from "../repositories/workspace.repository.js";




export const createWorkspaceController = async (req, res) => {
    try {
        const {name} = req.body
        const owner_id = req.user._id // el owner id lo sacamos del token req.user(viene del middleware)
        const newWorkspace = await workspaceRepository.createWorkspace({name, owner_id}) // llamamos al repositorio, 
        res.json({
            ok:true,
            status: 201,
            message: 'Workspace created',
            data:{
                newWorkspace
            }

        })


    } catch (error) {
        console.log("error al registrar", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }

    





}
export const getWorkspacesByUserController = async (req, res) => {
    try {
      const userId = req.user._id; // ID del usuario autenticado
      const workspaces = await Workspace.find({ owner: userId }); // Buscar todos los workspaces cuyo owner es el usuario autenticado
  
      res.status(200).json({
        ok: true,
        data: workspaces,
      });
    } catch (error) {
      console.error("Error al obtener los workspaces", error);
      res.status(500).send({
        ok: false,
        message: "Internal server error",
      });
    }
  };


export const inviteUserToWorkspaceController = async (req, res) => {
    try{
        const user_id = req.user._id // id del que invita
        const {invited_id, workspace_id} = req.params  // el invite_id tiene que ser el mismo nombre que en workspace.route
        const workspace_found =await workspaceRepository.addNweMember({owner_id:user_id, invited_id, workspace_id})
        res.json({
            ok:true,
            status: 201,
            message: 'User invited',
            data:{
                workspace: workspace_found
            } 
        })
    }
    catch (error) {
        console.log("error al registrar", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
    
}