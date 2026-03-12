require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files - serve frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// File upload config
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
app.use('/uploads', express.static(uploadsPath));

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

// API Routes
app.use('/api', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// MongoDB Connection with in-memory fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grievance_portal';
const PORT = process.env.PORT || 5000;

async function startServer() {
  let uri = MONGODB_URI;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Falling back to in-memory MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to in-memory MongoDB');

      // Auto-seed demo data for in-memory mode
      try {
        const seedFn = require('./seedInMemory');
        await seedFn();
        console.log('✅ Demo data seeded automatically');
      } catch (e) {
        console.log('⚠️  Demo seeding skipped:', e.message);
      }
    } catch (memErr) {
      console.error('⚠️  In-memory MongoDB unavailable:', memErr.message);
      console.log('💡 Server will start but API endpoints require a database.');
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 AI Grievance Portal server running on http://localhost:${PORT}`);
    console.log(`📊 Frontend: http://localhost:${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
  });
}

startServer();

module.exports = app;
