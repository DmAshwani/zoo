# Zoo Booking System API - Complete Guide

## 📚 API Documentation

Access the interactive Swagger UI documentation at:
```
http://localhost:8080/swagger-ui/index.html
```

Or view the OpenAPI specification at:
```
http://localhost:8080/v3/api-docs
```

## 🔐 Authentication Flow

### 1. Register a New User
**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobileNumber": "+91-9999999999",
  "roles": ["user"]
}
```

**Response:**
```json
{
  "message": "User registered successfully!"
}
```

---

### 2. Login to Get JWT Token
**Endpoint:** `POST /api/auth/signin`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzE0NTQzODAwLCJleHAiOjE3MTQ2MzAyMDB9.signature",
  "id": 1,
  "email": "john@example.com",
  "roles": ["ROLE_USER"]
}
```

---

### 3. Use JWT Token for Protected Endpoints
Add the token to the `Authorization` header:
```
Authorization: Bearer <your-token-here>
```

---

## 📋 Available Endpoints

### Authentication (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Login and get JWT token |

### Slots (No Auth for GET)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/slots/available?date=YYYY-MM-DD` | ❌ | Get available slots for a date |
| POST | `/api/slots/` | ✅ ADMIN | Create a new slot |
| PUT | `/api/slots/{id}` | ✅ ADMIN | Update a slot |

### Bookings (All Require Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/initiate` | Initiate a new booking |
| POST | `/api/bookings/confirm/{id}?paymentId={paymentId}` | Confirm booking after payment |
| GET | `/api/bookings/my-bookings` | Get user's bookings |

---

## 🧪 Testing with Swagger UI

### Step 1: Open Swagger UI
Navigate to: `http://localhost:8080/swagger-ui/index.html`

### Step 2: Register User
1. Click on "Authentication" section
2. Click POST `/api/auth/signup`
3. Click "Try it out"
4. Fill in user details:
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "mobileNumber": "+91-9876543210",
  "roles": ["user"]
}
```
5. Click "Execute"

### Step 3: Login
1. Click POST `/api/auth/signin`
2. Click "Try it out"
3. Fill in credentials:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
4. Click "Execute"
5. **Copy the token from the response**

### Step 4: Authorize in Swagger
1. Click the green "🔒 Authorize" button (top right)
2. Paste: `Bearer <your-token>`
3. Click "Authorize"
4. Click "Close"

### Step 5: Test Protected Endpoints
Now you can test any protected endpoint with authentication!

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "mobileNumber": "+91-9876543210",
    "roles": ["user"]
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Available Slots
```bash
curl -X GET "http://localhost:8080/api/slots/available?date=2026-04-16" \
  -H "Content-Type: application/json"
```

### Get My Bookings (with token)
```bash
curl -X GET http://localhost:8080/api/bookings/my-bookings \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json"
```

---

## 📝 API Sections in Swagger

### 1. **Authentication** - User login and registration
- User Login
- User Registration

### 2. **Slots** - Zoo booking slot management
- Get Available Slots (public)
- Create New Slot (admin)
- Update Slot (admin)

### 3. **Bookings** - Ticket booking management
- Initiate Booking (user)
- Confirm Booking (user)
- Get User's Bookings (user)

---

## 🔒 Role-Based Access

### ROLE_USER
- ✅ Register and login
- ✅ View available slots
- ✅ Create bookings
- ✅ View own bookings
- ❌ Create/update slots
- ❌ Admin functions

### ROLE_ADMIN
- ✅ All user permissions
- ✅ Create new slots
- ✅ Update slot capacity/status
- ✅ Manage bookings

---

## 🐛 Common Issues & Fixes

### "Unauthorized" Error
**Problem:** Getting 401 when accessing protected endpoint
**Solution:** 
1. Make sure you have a valid JWT token
2. Add `Authorization: Bearer <token>` header
3. Ensure token hasn't expired (24 hours default)

### "Email already in use"
**Problem:** Cannot register with existing email
**Solution:** Use a different email or login with existing credentials

### "Role not found"
**Problem:** Error during signup
**Solution:** Wait a few seconds after app startup - roles are being initialized

### "No available capacity"
**Problem:** Slot is full
**Solution:** Choose a different slot or date

---

## 📊 Database Schema

The application automatically creates these tables:
- `user` - User accounts
- `role` - User roles (ROLE_USER, ROLE_ADMIN)
- `user_roles` - User-role associations
- `slot` - Booking time slots
- `booking` - User bookings

---

## ⚙️ Configuration

### JWT Settings (application.properties)
```properties
jwt.secret=7d825dfa218d4d7a8cead888c75ff98af0743f5f3e9c52219d3fbc91ae0b8307
jwt.expirationMs=86400000  # 24 hours
```

### Server Settings
```properties
server.port=8080
spring.application.name=backend
```

### Database
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zoo_db
spring.datasource.username=zoo_admin
spring.datasource.password=zoo_password
```

---

## 🚀 Next Steps

1. **Create a booking slot** as ADMIN
   - POST `/api/slots/` with date, time, capacity

2. **Register a regular user**
   - POST `/api/auth/signup`

3. **Login** to get JWT token
   - POST `/api/auth/signin`

4. **View available slots**
   - GET `/api/slots/available?date=YYYY-MM-DD`

5. **Create a booking**
   - POST `/api/bookings/initiate`

6. **Confirm booking** after payment
   - POST `/api/bookings/confirm/{id}`

---

## 📞 Support

For API issues, check:
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI Spec: `http://localhost:8080/v3/api-docs`
- Application logs in terminal

