import mongoose from "mongoose"
import channelRepository from "../repositories/channel.repositoy.js"
import messageRepository from "../repositories/message.repository.js"
import Channel from "../models/Channel.model.js"

export const createChannelController = async (req, res) => {
    try{
        // obtenemos el nombre del canal
        const {name} = req.body
        // obtenemos el id del usuario que quiere crear el canal
        const user_id = req.user._id
        // obtenemos el id del workspace al que quiero añadir este canal
        const {workspace_id} = req.params
        const newChannel = await channelRepository.createChannel({name, user_id, workspace_id}) 
        res.json({
            ok:true,
            status: 201,
            message: 'Channel created',
            data:{
                newChannel
            }
        })

    }catch (error) {
        console.log("error al crear canal", error);


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

export const sendMEssageToChannelController = async (req, res) => {
    try{
        const {channel_id} = req.params
        const user_id = req.user._id
        const {content}= req.body

        ////
        if (!mongoose.Types.ObjectId.isValid(channel_id)) {
            throw new Error("Invalid channel_id");
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            throw new Error("Invalid user_id");
        }

        const new_message = await messageRepository.create({sender:user_id, channel_id, content})
        res.json({
            ok:true,
            status: 201,
            message: 'Message sent',
            data:{
                new_message
            }
        })


    }
    catch (error) {
        console.log("error al enviar mensaje", error);


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

export const getChannelByWorkspaceController = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const channel = await Channel.findOne({ workspace: workspace_id });

        if (!channel) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "No channel found for this workspace"
            });
        }

        res.status(200).json({
            ok: true,
            data: channel
        });
    } catch (error) {
        console.error("Error fetching channel:", error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Internal server error"
        });
    }
};


export const getMessageListFromChannelController = async (req, res) => {
    try{
        const user_id = req.user._id
        const {channel_id} = req.params
        const messages = await messageRepository.findMessageFromChannel({channel_id, user_id})
        res.json({
            ok:true,
            status: 200,
            message: 'Message list',
            data:{
                messages
            }
        })






    }
    catch (error) {
        console.log("error al obtener la lista de mensajes", error);


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