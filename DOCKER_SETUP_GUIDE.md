# 🐳 Docker Setup - Auto Data Initialization Guide

## ✅ What's Been Configured

The `docker-compose.yml` file is now set up to **automatically run** both SQL files when PostgreSQL starts:

### File Mounting Configuration

```yaml
volumes:
  - ./backend/src/main/resources/data.sql:/docker-entrypoint-initdb.d/01-data.sql
  - ./backend/src/main/resources/production-data.sql:/docker-entrypoint-initdb.d/02-production-data.sql
```

**How it works:**
1. ✅ Files are copied to `/docker-entrypoint-initdb.d/` directory
2. ✅ PostgreSQL automatically runs files in this directory
3. ✅ Files execute in **alphabetical order**:
   - First: `01-data.sql` (creates roles, admin user, test users, sample slots, bookings)
   - Then: `02-production-data.sql` (creates ticket types, add-on masters)
4. ✅ Only runs **once** during initial container creation

---

## 🚀 How to Use

### Step 1: Start the Database

```bash
# From project root: C:\Users\dataman\Desktop\zoo

docker-compose up -d
```

**What happens:**
- ✅ PostgreSQL 15 container starts
- ✅ Database `zoo_db` is created automatically
- ✅ `data.sql` runs automatically (creates tables and initial data)
- ✅ `production-data.sql` runs automatically (creates ticket types and add-ons)
- ✅ Admin user created: `sa@zoo.com` / `sa`
- ✅ Test users created
- ✅ Sample slots created
- ✅ Database is ready to use!

### Step 2: Verify Database is Ready

```bash
# Check if database is running
docker ps

# You should see: zoo_postgres container status as "Up"

# Check logs to verify SQL files ran
docker-compose logs db

# Look for: "database system is ready to accept connections"
```

### Step 3: Connect to Database (optional, for verification)

```bash
# Get into PostgreSQL shell
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db

# Inside psql, check tables were created:
\dt

# Check admin user was created:
SELECT * FROM users WHERE email = 'sa@zoo.com';

# Exit psql
\q
```

---

## 📋 What Data Gets Loaded

### From `01-data.sql`

**Roles:**
- ✅ ROLE_USER
- ✅ ROLE_ADMIN

**Users:**
- ✅ Admin: `sa@zoo.com` / `sa` (password: BCrypt hashed)
- ✅ Test: `priya@email.com` / `password`
- ✅ Test: `rahul@email.com` / `password`

**Slots (for bookings):**
- ✅ 2026-04-16 09:00-11:00 (100 capacity)
- ✅ 2026-04-16 11:00-13:30 (100 capacity)
- ✅ 2026-04-16 14:00-16:00 (80 capacity)

**Sample Bookings:**
- ✅ Priya's confirmed booking
- ✅ Rahul's pending booking

### From `02-production-data.sql`

**Ticket Types:**
- ✅ ADULT: $100
- ✅ CHILD: $50

**Add-On Services:**
- ✅ Camera: $100 per person
- ✅ Safari: $150 per person
- ✅ VIP Meal: $500 per booking

---

## ✅ Verification Checklist

After running `docker-compose up -d`:

- [ ] PostgreSQL container is running: `docker ps | grep zoo_postgres`
- [ ] Can connect to database: `psql -U zoo_admin -d zoo_db -h localhost`
- [ ] Admin user exists: Check in database
- [ ] Roles created: Check `roles` table
- [ ] Slots created: Check `slots` table with 3 entries
- [ ] Ticket types created: Check `ticket_types` table
- [ ] Add-ons created: Check `add_on_master` table

---

## 🔄 Resetting the Database

### If you need to start fresh:

```bash
# Stop the containers
docker-compose down

# Remove the data volume (CAREFUL: This deletes all data!)
docker volume rm zoo_pgdata

# Start again (will re-run SQL files)
docker-compose up -d
```

**After this:**
- ✅ All previous data is deleted
- ✅ New database created
- ✅ SQL files run again
- ✅ Fresh data loaded

---

## 🐛 Troubleshooting

### Issue: Container won't start

```bash
# Check logs
docker-compose logs db

# Common causes:
# - SQL syntax error in data.sql or production-data.sql
# - Port 5432 already in use
# - Insufficient disk space
```

**Solution:**
```bash
# Kill existing container
docker-compose down

# Check if port 5432 is in use
netstat -ano | findstr :5432

# Start again
docker-compose up -d
```

### Issue: SQL files not running

```bash
# Verify files exist at correct location:
ls backend/src/main/resources/data.sql
ls backend/src/main/resources/production-data.sql

# Check file mounts in docker-compose.yml:
# Should show:
# - ./backend/src/main/resources/data.sql:/docker-entrypoint-initdb.d/01-data.sql
# - ./backend/src/main/resources/production-data.sql:/docker-entrypoint-initdb.d/02-production-data.sql
```

### Issue: Admin can't login after data loads

```bash
# Verify admin user was created:
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db -c "SELECT * FROM users WHERE email = 'sa@zoo.com';"

# Should show: sa@zoo.com with BCrypt password hash
```

---

## 📊 File Execution Order

PostgreSQL runs files in `/docker-entrypoint-initdb.d/` in **alphabetical order**:

```
1. 01-data.sql              ← Creates base schema + roles + users
   ├── CREATE TABLE roles
   ├── CREATE TABLE users
   ├── INSERT INTO roles
   ├── INSERT INTO users
   └── INSERT INTO bookings

2. 02-production-data.sql   ← Creates production data
   ├── INSERT INTO ticket_types
   ├── INSERT INTO add_on_master
   └── INSERT INTO slot_pricing (commented)
```

**Why numbered prefixes?**
- ✅ Ensures consistent execution order
- ✅ Roles and users created first (other tables depend on them)
- ✅ Production data created after
- ✅ No dependency issues

---

## 🔑 Quick Commands

```bash
# Start database with auto-initialization
docker-compose up -d

# View logs to see if SQL ran
docker-compose logs db | tail -20

# Stop database
docker-compose down

# Restart database (keeps data)
docker-compose restart db

# Remove everything and start fresh
docker-compose down -v && docker-compose up -d

# Connect to database directly
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db

# Run custom query
docker exec -it zoo_postgres psql -U zoo_admin -d zoo_db -c "SELECT * FROM users;"
```

---

## 📈 Timeline

When you run `docker-compose up -d`:

```
Time 0s:     Container starts
Time 1-2s:   PostgreSQL initializes
Time 3-4s:   01-data.sql executes (creates tables, users, roles)
Time 5-6s:   02-production-data.sql executes (creates ticket types, add-ons)
Time 7s:     "database system is ready to accept connections"
Time 8s:     Ready to use! ✅
```

**Total time: ~10 seconds**

---

## ✨ Database Structure After Initialization

```
zoo_db (database)
├── roles (table)
│   ├── ROLE_USER
│   └── ROLE_ADMIN
│
├── users (table)
│   ├── Admin: sa@zoo.com
│   ├── Priya: priya@email.com
│   └── Rahul: rahul@email.com
│
├── user_roles (table)
│   └── Link users to roles
│
├── slots (table)
│   ├── 2026-04-16 09:00-11:00
│   ├── 2026-04-16 11:00-13:30
│   └── 2026-04-16 14:00-16:00
│
├── bookings (table)
│   ├── Priya's booking (CONFIRMED)
│   └── Rahul's booking (PENDING)
│
├── ticket_types (table)
│   ├── ADULT: $100
│   └── CHILD: $50
│
└── add_on_master (table)
    ├── Camera: $100
    ├── Safari: $150
    └── VIP Meal: $500
```

---

## 🎯 What You Can Do Now

After running `docker-compose up -d`:

1. ✅ **Login as Admin**
   - Email: `sa@zoo.com`
   - Password: `sa`

2. ✅ **Start Backend**
   ```bash
   cd backend && .\mvnw spring-boot:run
   ```

3. ✅ **Start Frontend**
   ```bash
   cd frontend && npm start
   ```

4. ✅ **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080
   - API Docs: http://localhost:8080/swagger-ui/index.html

5. ✅ **Test Booking Flow**
   - View sample slots (already created)
   - Create bookings
   - Process payments

---

## 💾 Data Persistence

**Important:**
- ✅ Data persists in Docker volume: `pgdata`
- ✅ Even if container stops, data remains
- ✅ Use `docker-compose down -v` to delete data

---

**Status:** ✅ Docker compose configured for auto-initialization  
**SQL Files:** Both data.sql and production-data.sql will run automatically  
**Time to Ready:** ~10 seconds after `docker-compose up -d`


