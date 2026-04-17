# 🦁 Zoo Booking System - Complete Application

A modern, full-stack ticket booking system for **The Civic Naturalist Botanical Gardens & Zoo** with admin dashboard, payment integration, and responsive design.

## 🎯 Quick Start (30 seconds)

### 1️⃣ Start Database
```bash
cd zoo
docker-compose up -d
# Waits for PostgreSQL startup...
```

### 2️⃣ Start Backend
```bash
cd backend
.\mvnw spring-boot:run
# Backend ready at http://localhost:8080
```

### 3️⃣ Start Frontend
```bash
cd frontend
npm install  # First time only
npm start
# Frontend ready at http://localhost:3000
```

---

## 🔐 Admin Login

**Email:** `sa@zoo.com`  
**Password:** `sa`

👉 Visit `http://localhost:3000` and click "Sign In"

---

## 📱 Features

### For Visitors
- 🎫 Browse and book tickets
- 📅 Select visit date & time slots
- 👥 Choose ticket types (Adult/Child)
- 💳 Secure payment via Razorpay
- 🎟️ Instant ticket confirmation
- 📧 Email confirmation & receipt

### For Admins
- 📊 Dashboard with analytics
- 🗓️ Manage booking slots
- 👤 User management
- 💰 Revenue analytics
- 💵 Pricing configuration
- 📑 Booking management

---

## 🏗️ Project Structure

```
zoo/
├── backend/                    # Spring Boot (Java)
│   ├── API endpoints
│   ├── Database models
│   ├── Authentication (JWT)
│   └── Payment integration
│
├── frontend/                   # React (JavaScript)
│   ├── Landing page
│   ├── Booking workflow
│   ├── Admin dashboard
│   └── Responsive design
│
├── stitch_screens/             # UI mockups (HTML)
│   ├── Desktop versions
│   └── Mobile versions
│
└── docker-compose.yml          # PostgreSQL setup
```

---

## 🚀 Available Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login

### Bookings
- `GET /api/bookings/my-bookings` - View my bookings
- `POST /api/bookings/initiate` - Start booking
- `POST /api/bookings/confirm` - Confirm booking

### Admin
- `GET /api/slots` - List all slots
- `POST /api/slots` - Create slot (Admin)
- `GET /api/bookings` - All bookings (Admin)

### Documentation
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [`SYSTEM_SUMMARY.md`](./SYSTEM_SUMMARY.md) | Complete system overview |
| [`backend/QUICKSTART.md`](./backend/QUICKSTART.md) | Backend setup & testing |
| [`backend/API_GUIDE.md`](./backend/API_GUIDE.md) | API endpoints reference |
| [`backend/ADMIN_CREDENTIALS.md`](./backend/ADMIN_CREDENTIALS.md) | Default credentials |
| [`stitch_screens/`](./stitch_screens/) | UI mockup references |

---

## 🧪 Test the System

### 1. Login as Admin
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sa@zoo.com",
    "password": "sa"
  }'
```

### 2. View Available Slots
```bash
curl -X GET http://localhost:8080/api/slots \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

### 3. Create a Booking (as User)
```bash
curl -X POST http://localhost:8080/api/bookings/initiate \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": 1,
    "adultTickets": 2,
    "childTickets": 1,
    "addOns": [{"addOnId": 1, "quantity": 1}]
  }'
```

---

## 💾 Default Data

### Admin User
- Email: `sa@zoo.com`
- Password: `sa`
- Role: Administrator

### Test Users
- Email: `priya@email.com` | Password: `password`
- Email: `rahul@email.com` | Password: `password`

### Sample Slots (automatically created)
- Date: 2026-04-16
- Times: 09:00-11:00, 11:00-13:30, 14:00-16:00
- Capacity: 80-100 per slot

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS, Axios |
| **Backend** | Spring Boot 3, Spring Security, JPA |
| **Database** | PostgreSQL 14 |
| **Payment** | Razorpay API |
| **Auth** | JWT (24-hour expiration) |
| **Deployment** | Docker, Docker Compose |

---

## 📋 System Requirements

- **Node.js** 16+ (for frontend)
- **Java** 17+ (for backend)
- **Docker** & **Docker Compose** (for PostgreSQL)
- **4GB RAM** (minimum)
- **200MB Disk Space**

---

## 🔗 Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8080 |
| **Swagger Docs** | http://localhost:8080/swagger-ui/index.html |
| **Database** | localhost:5432 |

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear Maven cache
cd backend
.\mvnw clean
.\mvnw spring-boot:run
```

### Frontend port 3000 already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database connection error
```bash
# Verify Docker is running
docker ps

# Check PostgreSQL logs
docker-compose logs postgres
```

---

## 📧 Support

For issues or questions:
1. Check documentation in `backend/QUICKSTART.md`
2. Review API docs at `http://localhost:8080/swagger-ui/index.html`
3. Check application logs for detailed errors

---

## ✅ What's Included

- ✅ Full booking workflow
- ✅ Admin dashboard
- ✅ Payment integration (Razorpay)
- ✅ Email notifications
- ✅ Responsive design (mobile & desktop)
- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Database with sample data
- ✅ API documentation (Swagger)
- ✅ Docker setup

---

## 🎓 Learning Path

1. **Start here:** Read this README
2. **Backend setup:** See `backend/QUICKSTART.md`
3. **Understand APIs:** Check `backend/API_GUIDE.md`
4. **Admin credentials:** See `backend/ADMIN_CREDENTIALS.md`
5. **System overview:** Review `SYSTEM_SUMMARY.md`

---

**Last Updated:** April 17, 2026  
**Status:** ✅ Ready for Testing  
**Version:** 1.0.0


