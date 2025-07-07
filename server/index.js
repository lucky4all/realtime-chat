import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
//import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { Server } from 'socket.io'
import { createServer } from 'node:http';

dotenv.config();

const app = express();
const port = process.env.PORT
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on('connection', (socket) => {
    console.log("Nueva conexion!", socket.id);

    socket.on('message', (msg) => {
        console.log(msg);
        io.emit("message", msg);
    })
    
    socket.on('disconnect', () => {
        console.log("Conexión perdida")
    })
})

/*
Middlewares de Express.js
*/

app.use(cors())
// app.use(helmet())
app.use(morgan())

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'index.html'))
})

httpServer.listen(port, () => {
    console.info("Servidor corriendo por el puerto: ", port)
})