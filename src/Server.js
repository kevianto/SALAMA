import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import ConnectToDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


app.use(cors());
app.use(express.json());

// Socket middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/users', userRoutes);
app.use('/sensors', sensorRoutes);

io.on('connection', (socket) => {
  console.log('Frontend connected via WebSocket:', socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  await ConnectToDB();
  console.log(`app running at http://localhost:${PORT}`);
});
