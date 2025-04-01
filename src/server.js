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


app.use(cors())


app.use(express.json())



app.use((req, res, next) => {
    // Establece el timeout a 30 segundos (30000 ms) para todas las solicitudes
    req.setTimeout(30000);  // Timeout para la solicitud
    res.setTimeout(30000);  // Timeout para la respuesta
    next();
  });


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

