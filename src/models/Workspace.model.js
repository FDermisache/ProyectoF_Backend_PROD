import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            },
        owner:{
            type: mongoose.Schema.Types.ObjectId, // LE estamos diciendo que el dueño va a ser de tipo ID
            ref: "User",  // le pasamos la referencia que este relacionado al USer.model.js
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        

    }
);


const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace