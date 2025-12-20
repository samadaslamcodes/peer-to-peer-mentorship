require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('./seed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    // 1. Try Atlas / Environment URI
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/p2p-learning', {
      serverSelectionTimeoutMS: 5000 // Fail fast if not reachable
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Primary MongoDB Connection Failed:', error.message);

    try {
      // 2. Try Local MongoDB
      console.log('⚠️ Attempting fallback to local MongoDB (localhost:27017)...');
      const localConn = await mongoose.connect('mongodb://localhost:27017/p2p-learning', {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`✅ Fallback: Connected to Local MongoDB: ${localConn.connection.host}`);
    } catch (localError) {
      console.error('❌ Local MongoDB Fallback Failed:', localError.message);

      try {
        // 3. Try In-Memory MongoDB (Zero-config fallback)
        console.log('⚠️ Attempting fallback to In-Memory MongoDB...');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const memoryConn = await mongoose.connect(uri);
        console.log(`✅ Fallback: Connected to In-Memory MongoDB: ${memoryConn.connection.host}`);
        console.log('ℹ️  Note: Data will be lost when server restarts.');

        // Seed data since it's a fresh in-memory DB
        console.log('🌱 Seeding in-memory database...');
        await seedData();
      } catch (memoryError) {
        console.error('❌ In-Memory MongoDB Fallback Failed:', memoryError.message);
        console.error('CRITICAL: Could not connect to any database.');
      }
    }
  }
};

connectDB();
// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes (To be created)
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const matchingRoutes = require('./routes/matching');
const sessionRoutes = require('./routes/session');
const gamificationRoutes = require('./routes/gamification');
const meetingsRoutes = require('./routes/meetings');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/meetings', meetingsRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
