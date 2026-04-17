# 🎫 Zoo Booking System - Quick Reference Card

## 🔑 Admin Login

```
Email:    sa@zoo.com
Password: sa
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| Backend | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger-ui/index.html |
| Database | localhost:5432 |

## 🚀 Startup Commands

```bash
# Database
docker-compose up -d

# Backend (Terminal 1)
cd backend && .\mvnw spring-boot:run

# Frontend (Terminal 2)
cd frontend && npm start
```

## 👥 Test Users

| Email | Password |
|-------|----------|
| sa@zoo.com | sa |
| priya@email.com | password |
| rahul@email.com | password |

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Quick start |
| SYSTEM_SUMMARY.md | Full overview |
| backend/ADMIN_CREDENTIALS.md | Login guide |
| backend/API_GUIDE.md | API reference |
| COMPLETION_REPORT.md | Changes detail |

## 🧪 Test Login (cURL)

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"sa@zoo.com","password":"sa"}'
```

## ✅ Features

- ✅ Ticket booking system
- ✅ Admin dashboard
- ✅ User authentication
- ✅ Payment integration
- ✅ Responsive design
- ✅ API documentation

## 📋 Implementation Status

**✅ COMPLETE & READY FOR USE**

- Admin credentials updated
- Database configured
- Backend APIs working
- Frontend ready
- Documentation complete

## 🎯 Next Step

Open `README.md` for detailed setup instructions!

---

**Last Updated:** April 17, 2026  
**System Version:** 1.0.0  
**Status:** Production Ready

