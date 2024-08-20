import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { connectToSocket } from './controllers/socketManager.js';
import cors from 'cors';
import userRoutes from './routes/users.routes.js';


const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));


const start = async () => {
    const connectionDb = await mongoose.connect("mongodb+srv://zeyaurrahman078608:vSP4kzatI16qe2u7@cluster0.kkunq.mongodb.net/");
    console.log(`MONGO Connected DB HOST: ${connectionDb.connection.host}`);
    server.listen(app.get("port"), () => {
        console.log('Server started on port 8000');
    });
}

start();