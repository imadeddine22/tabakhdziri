# Tabakh Dziri Backend API 🍽️

Complete Node.js + Express + MongoDB backend for Tabakh Dziri food delivery service with JWT authentication.

## 📋 Features

- ✅ User authentication (Register/Login) with JWT
- ✅ Password hashing with bcrypt
- ✅ Protected routes requiring authentication
- ✅ Full CRUD operations for orders
- ✅ Email notifications (Welcome & Order confirmation)
- ✅ Role-based access control (User/Admin)
- ✅ MongoDB integration
- ✅ CORS enabled for Next.js frontend

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd food-delivery-backend
npm install
```

### 2. Configure Environment Variables

Edit `.env` file and add your Gmail app password:

```env
EMAIL_PASS=your_gmail_app_password_here
```

**How to get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy and paste in `.env`

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## 📁 Project Structure

```
food-delivery-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── orderController.js # Order CRUD operations
│   └── userController.js  # User profile management
├── middleware/
│   └── auth.js            # JWT verification & authorization
├── models/
│   ├── User.js            # User schema
│   └── Order.js           # Order schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── orderRoutes.js     # Order endpoints
│   └── userRoutes.js      # User endpoints
├── utils/
│   └── emailService.js    # Email sending functions
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── server.js              # Main entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Private | Create order (requires login) |
| GET | `/api/orders` | Private | Get my orders |
| GET | `/api/orders/:id` | Private | Get single order |
| PUT | `/api/orders/:id` | Private | Update order |
| DELETE | `/api/orders/:id` | Private | Delete order |
| GET | `/api/orders/all/orders` | Admin | Get all orders (admin) |
| PATCH | `/api/orders/:id/status` | Admin | Update order status (admin) |

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/profile` | Private | Get user profile |
| PUT | `/api/users/profile` | Private | Update user profile |
| GET | `/api/users` | Admin | Get all users (admin) |

## 💻 Frontend Integration Examples

### 1. API Client Setup

Create `lib/api.js` in your Next.js frontend:

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
```

### 2. Register User

```javascript
import api from '@/lib/api';

const handleRegister = async (userData) => {
    try {
        const response = await api.post('/auth/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone
        });
        
        // Save token
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        console.log('Registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data?.message);
        throw error;
    }
};
```

### 3. Login User

```javascript
import api from '@/lib/api';

const handleLogin = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        
        // Save token
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        console.log('Login successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data?.message);
        throw error;
    }
};
```

### 4. Create Order (Protected Route)

```javascript
import api from '@/lib/api';

const handleCreateOrder = async (orderData) => {
    try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to place an order');
            window.location.href = '/login';
            return;
        }
        
        const response = await api.post('/orders', {
            customerInfo: {
                firstName: orderData.firstName,
                lastName: orderData.lastName,
                phone: orderData.phone,
                email: orderData.email
            },
            items: orderData.items, // Cart items
            eventDetails: {
                wilaya: orderData.wilaya,
                location: orderData.location,
                date: orderData.date,
                time: orderData.time
            },
            totalAmount: orderData.totalAmount,
            notes: orderData.notes
        });
        
        console.log('Order created:', response.data);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        console.error('Order creation error:', error.response?.data?.message);
        throw error;
    }
};
```

### 5. Get User Orders

```javascript
import api from '@/lib/api';

const fetchMyOrders = async () => {
    try {
        const response = await api.get('/orders');
        console.log('My orders:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data?.message);
        throw error;
    }
};
```

### 6. Logout User

```javascript
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};
```

### 7. Check if User is Logged In

```javascript
const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
```

## 🔐 Authentication Flow

1. **User Registration:**
   - User fills registration form
   - Frontend sends data to `/api/auth/register`
   - Backend creates user, hashes password, sends welcome email
   - Returns JWT token
   - Frontend stores token in localStorage

2. **User Login:**
   - User enters email/password
   - Frontend sends to `/api/auth/login`
   - Backend verifies credentials
   - Returns JWT token
   - Frontend stores token in localStorage

3. **Protected Requests:**
   - User tries to create order
   - Frontend includes token in Authorization header
   - Backend verifies token in middleware
   - If valid, processes request
   - If invalid/missing, returns 401 error

## 📧 Email Configuration

The system sends two types of emails:

1. **Welcome Email** - Sent when user registers
2. **Order Confirmation** - Sent when order is created

Emails are sent to: `tabakhdziri@gmail.com`

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token expiration (7 days)
- ✅ Protected routes requiring authentication
- ✅ Role-based authorization (User/Admin)
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variables for sensitive data

## 🧪 Testing the API

### Using Postman or Thunder Client:

1. **Register:**
```json
POST http://localhost:5000/api/auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "phone": "0555123456"
}
```

2. **Login:**
```json
POST http://localhost:5000/api/auth/login
{
    "email": "john@example.com",
    "password": "123456"
}
```

3. **Create Order (add token in Authorization header):**
```json
POST http://localhost:5000/api/orders
Headers: Authorization: Bearer YOUR_JWT_TOKEN
{
    "customerInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "0555123456"
    },
    "items": [
        {
            "dishId": "1",
            "name": "Couscous",
            "quantity": 50,
            "price": 500
        }
    ],
    "eventDetails": {
        "wilaya": "Alger",
        "location": "Hotel Hilton",
        "date": "2024-06-15",
        "time": "18:00"
    },
    "totalAmount": 25000
}
```

## ⚠️ Important Notes

1. **Orders require authentication** - Users must be logged in to create orders
2. **Token expiration** - Tokens expire after 7 days
3. **Email password** - Update EMAIL_PASS in `.env` with your Gmail app password
4. **MongoDB connection** - Already configured with your connection string
5. **CORS** - Configured for `http://localhost:3000` (Next.js frontend)

## 🔧 Environment Variables Reference

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tabakhdziri@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Tabakh Dziri <tabakhdziri@gmail.com>
FRONTEND_URL=http://localhost:3000
```

## 📝 Next Steps

1. Install dependencies: `npm install`
2. Configure Gmail app password in `.env`
3. Start server: `npm run dev`
4. Test endpoints with Postman/Thunder Client
5. Integrate with Next.js frontend
6. Create login/register pages in frontend
7. Protect cart checkout with authentication

---

**Made with ❤️ for Tabakh Dziri**
