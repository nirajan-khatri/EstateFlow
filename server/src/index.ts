import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

console.log('Starting server initialization...');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: true, // Reflect the request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Property Management API is running');
});

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} connected and joined room`);
  } else {
    console.log('A user connected without ID:', socket.id);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Keep process alive
setInterval(() => { }, 1000);
