import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import instagramRoutes from './routes/instagramRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // في وضع التطوير، اقبل جميع المصادر
    if (process.env.NODE_ENV !== 'production') {
      console.log('📡 CORS Request from origin:', origin);
      callback(null, true);
    } else {
      // في وضع الإنتاج، تحقق من المص Source
      const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.originalUrl}`);
  console.log('  من:', req.headers.origin || 'no origin');
  console.log('  Content-Type:', req.headers['content-type']);
  if (req.headers.authorization) {
    console.log('  ✅ Authorization header موجود');
  } else {
    console.log('  ⚠️ No Authorization header');
  }
  next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/instagram', instagramRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tabakh Dziri API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('\n\n========== خطأ عام ==========');
  console.error('الوقت:', new Date().toLocaleString());
  console.error('المسار:', req.originalUrl);
  console.error('الطريقة:', req.method);
  console.error('نوع الخطأ:', err.name);
  console.error('رسالة الخطأ:', err.message);
  console.error('التفاصيل الكاملة:', err);
  console.error('================================\n');

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    errorName: err.name,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});
