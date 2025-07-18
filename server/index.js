import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import morgan from 'morgan';
import path from 'node:path';
import { Server } from 'socket.io'
import { createServer } from 'node:http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on('connection', (socket) => {
    console.log("Nueva conexion!", socket.id);

    socket.on('message', (msg) => {
        io.emit("message", { user: msg.user, text: msg.text })
    })
    
    socket.on('disconnect', () => {
        console.log("Conexión perdida")
    })
})

/*
Middlewares de Express.js
*/

app.use(cors({
    origin: ['https://realtime-chat-mb0z.onrender.com/'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}))

app.use(helmet({contentSecurityPolicy: false}))

app.use(morgan())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'index.html'))
})

httpServer.listen(port, () => {
    console.info("Servidor corriendo por el puerto: ", port)
})