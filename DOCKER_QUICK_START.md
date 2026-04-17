# 🚀 QUICK START - Docker Auto-Initialization

## ⚡ One Command Setup

```bash
# From C:\Users\dataman\Desktop\zoo directory

docker-compose up -d
```

**This automatically:**
- ✅ Starts PostgreSQL container
- ✅ Creates database `zoo_db`
- ✅ Runs `data.sql` (creates tables, users, slots)
- ✅ Runs `production-data.sql` (creates ticket types)
- ✅ Creates admin user: `sa@zoo.com` / `sa`
- ✅ Loads sample data (3 slots, 2 bookings)

**Time:** ~10 seconds

---

## 🎯 Complete Startup (3 terminals)

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend
.\mvnw spring-boot:run

# Terminal 3: Frontend
cd frontend
npm start
```

Then open: **http://localhost:3000**

---

## 🔐 Login

```
Email:    sa@zoo.com
Password: sa
```

---

## ✅ Verify It's Working

```bash
# Check container running
docker ps | grep zoo_postgres

# Check database initialized
docker-compose logs db | grep "ready to accept"

# Check admin user created
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db -c "SELECT COUNT(*) FROM users;"
# Should show: 3 (admin + 2 test users)

# Check slots loaded
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db -c "SELECT COUNT(*) FROM slots;"
# Should show: 3
```

---

## 🔧 Useful Commands

```bash
# View database logs
docker-compose logs db

# Stop database
docker-compose down

# Restart database (keeps data)
docker-compose restart db

# Reset everything (DELETES DATA)
docker-compose down -v

# Connect directly to database
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db
```

---

## 📊 What Gets Loaded

```
✅ Admin: sa@zoo.com / sa
✅ Users: priya@email.com, rahul@email.com
✅ Slots: 3 sample booking slots (2026-04-16)
✅ Tickets: ADULT $100, CHILD $50
✅ Add-ons: Camera, Safari, VIP Meal
```

---

## 🎓 File Execution Order

When `docker-compose up -d` runs:

```
1. PostgreSQL starts
2. 01-data.sql executes         (tables, users, slots, bookings)
3. 02-production-data.sql runs  (ticket types, add-ons)
4. Database ready! ✅
```

---

## 📍 Ports

- Database: `localhost:5432`
- Backend:  `localhost:8080`
- Frontend: `localhost:3000`

---

## ❌ Troubleshooting

### Container won't start?
```bash
docker-compose down && docker-compose up -d
```

### Port already in use?
```bash
# Kill process on port 5432
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

### Can't login?
```bash
# Verify user exists
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db -c "SELECT * FROM users WHERE email='sa@zoo.com';"
```

---

**Status:** ✅ Ready to run!


