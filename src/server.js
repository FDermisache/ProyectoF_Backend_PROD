import ENVIROMENT from "./config/enviroment.config.js";
import express from 'express'
import authRouter from "./routes/auth.router.js";
import mongoose from "./config/mongoDB.config.js";
import { sendMail } from "./utils/mailer.utils.js";
import cors from 'cors'
import authMiddleware from "./middlewares/authMiddleware.js";
import workspace_router from "./routes/workspace.router.js";
import channelRouter from "./routes/channel.router.js";

const app = express()


const allowedOrigins = [
    'https://proyecto-f-frontend-prod-9w3s.vercel.app',
    'https://proyecto-f-frontend-prod-git-786edd-federicos-projects-490a97db.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));





app.use(express.json())






app.use('/api/auth', authRouter)
app.use('/api/workspace', workspace_router)
app.use('/api/channel', channelRouter)

app.get('/api/test/comprar', authMiddleware , (req,res)=> {
    console.log(req.user) // obtenemos la informacion de quien quiere comprar
    res.json({
        message: 'producto comprado'
    })
}
)
app.listen(ENVIROMENT.PORT, () =>{
    console.log(`El servidor se esta ejecutando en http://localhost:${ENVIROMENT}`)
})

