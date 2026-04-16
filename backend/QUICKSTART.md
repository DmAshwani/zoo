# Quick Start Guide - Production Booking System

## 🚀 Getting Started

### 1. Database Setup

Ensure PostgreSQL is running with the zoo_db database:

```bash
# Docker (if using Docker Compose)
docker-compose up -d

# Or verify PostgreSQL is running
psql -U zoo_admin -d zoo_db
```

### 2. Start Application

```bash
cd C:\Users\dataman\Desktop\zoo\backend
.\mvnw spring-boot:run
```

The application will:
- ✅ Create all database tables (Hibernate)
- ✅ Initialize roles (data.sql)
- ✅ Initialize ticket types and add-ons (production-data.sql)
- ✅ Start scheduler (runs every 2 minutes)

### 3. Access Swagger UI

Navigate to: http://localhost:8080/swagger-ui/index.html

---

## 📋 Testing the Booking Flow

### Test 1: Register User
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

### Test 2: Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Copy the token from response
TOKEN="eyJhbGciOi..."
```

### Test 3: Create Slot (Admin)
First, register as admin:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "mobileNumber": "+91-9876543210",
    "roles": ["admin"]
  }'

# Login as admin and get token
ADMIN_TOKEN="eyJhbGciOi..."

# Create a slot
curl -X POST http://localhost:8080/api/slots \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slotDate": "2026-04-20",
    "startTime": "09:00:00",
    "endTime": "12:00:00",
    "totalCapacity": 100,
    "isActive": true
  }'

# Note: Copy the slot ID from response (e.g., id: 1)
```

### Test 4: Calculate Price (Optional)
```bash
# This would require adding an endpoint to expose PricingService
# For now, price is calculated during booking initiation
```

### Test 5: Initiate Booking
```bash
curl -X POST http://localhost:8080/api/bookings/initiate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": 1,
    "adultTickets": 2,
    "childTickets": 1,
    "addOns": [
      {"addOnId": 1, "quantity": 1}
    ]
  }'

# Response:
# {
#   "id": 123,
#   "status": "PENDING",
#   "totalAmount": 675.0,
#   "razorpayOrderId": "order_123_1702300000000",
#   "expiryTime": "2026-04-16T15:35:00"
# }

# Copy booking ID (e.g., 123)
BOOKING_ID="123"
```

### Test 6: Simulate Payment Success
```bash
# In production, Razorpay webhook calls this
# For testing, manually call webhook:

curl -X POST http://localhost:8080/api/payments/webhook/razorpay \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_123_1702300000000",
    "paymentId": "pay_ABCD1234",
    "status": "PAYMENT_SUCCESS"
  }'

# Result: Booking status changes to CONFIRMED
```

### Test 7: Verify Booking Confirmed
```bash
curl -X GET http://localhost:8080/api/bookings/my-bookings \
  -H "Authorization: Bearer $TOKEN"

# Result: Should show booking with status "CONFIRMED"
```

### Test 8: Test Expiry (Optional)
```bash
# Change expiryTime to past in database, or
# Wait 10 minutes, scheduler will mark as EXPIRED
# Capacity will be automatically released
```

---

## 🔍 Database Queries for Verification

### Check Bookings
```sql
SELECT id, status, total_amount, expiry_time FROM bookings;
```

### Check Capacity
```sql
SELECT id, slot_date, available_capacity FROM slots;
```

### Check Add-On Bookings
```sql
SELECT id, name, booked_capacity, available_capacity FROM add_on_master;
```

### Check Audit Log
```sql
SELECT id, booking_id, status, error_message FROM booking_audit;
```

---

## 🧪 Test Scenarios

### Scenario A: Successful Booking
1. Initiate booking → PENDING, capacity reserved
2. Webhook success → CONFIRMED, ticket generated
3. Verify capacity deducted
4. ✅ Result: Booking confirmed

### Scenario B: Payment Failure
1. Initiate booking → PENDING, capacity reserved
2. Webhook failure → FAILED, capacity released
3. Verify capacity restored
4. ✅ Result: Capacity available again

### Scenario C: Booking Expiry
1. Initiate booking → PENDING + 10 min expiry
2. Wait for scheduler (every 2 min)
3. Booking marked EXPIRED, capacity released
4. ✅ Result: Automatic cleanup

### Scenario D: Overbooking Prevention
1. Create slot with capacity 5
2. Initiate booking 1: reserve 3
3. Initiate booking 2: try to reserve 4
4. ✅ Result: Booking 2 fails (only 2 available)

---

## 📊 Monitoring

### Check Scheduler Logs
```
Application logs will show:
"Running expired booking handler..."
"Found X expired pending bookings"
"Expired booking ID has been processed"
```

### Monitor Add-On Capacity
```sql
-- Check which add-ons are at capacity
SELECT name, booked_capacity, available_capacity 
FROM add_on_master 
WHERE available_capacity IS NOT NULL;
```

### Check Pending Bookings
```sql
-- List all pending bookings and their expiry times
SELECT id, status, expiry_time, total_amount 
FROM bookings 
WHERE status = 'PENDING' 
ORDER BY expiry_time ASC;
```

---

## ⚙️ Configuration

### Change Booking Expiry Time
Edit `BookingService.java`:
```java
private static final int BOOKING_EXPIRY_MINUTES = 10;
// Change to your desired minutes
```

### Change Scheduler Frequency
Edit `BookingExpiryScheduler.java`:
```java
@Scheduled(fixedDelay = 120000) // milliseconds
// Change to your desired interval
```

### Add More Add-On Types
Insert into production-data.sql:
```sql
INSERT INTO add_on_master (...) VALUES 
('Photography', 'PER_PERSON', 200, 1, NULL, 0, true);
```

---

## 🐛 Troubleshooting

### Issue: Booking not confirming after payment
- Check logs for webhook errors
- Verify payment webhook URL configured in Razorpay
- Check booking_audit table for failure reason

### Issue: Capacity not being released
- Verify scheduler is running (check logs)
- Check if booking status is PENDING
- Verify expiryTime is in the past

### Issue: Add-on not deducting capacity
- Check add_on_master table for capacity values
- Verify add-on ID exists in request
- Check booking_audit for validation errors

### Issue: Payment webhook returns 401
- Implement proper Razorpay signature verification
- Ensure webhook secret configured
- Verify request headers include signature

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PRODUCTION_BOOKING_SYSTEM.md` | Complete implementation details |
| `IMPLEMENTATION_SUMMARY.md` | Summary of features and status |
| `API_GUIDE.md` | API endpoint documentation |
| `PROJECT_CONTEXT.md` | Project analysis and questions |
| `production-data.sql` | Database initialization |

---

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] All code compiled successfully
- [ ] Database migrations applied
- [ ] Razorpay account created
- [ ] Webhook URL configured
- [ ] Environment variables set
- [ ] Logging configured
- [ ] Error monitoring enabled
- [ ] Load testing completed

### Environment Variables
```
DATABASE_URL=jdbc:postgresql://localhost:5432/zoo_db
DATABASE_USER=zoo_admin
DATABASE_PASSWORD=zoo_password
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
```

### Production Docker Build
```bash
cd C:\Users\dataman\Desktop\zoo\backend
.\mvnw clean package -DskipTests
docker build -t zoo-booking:1.0 .
docker run -p 8080:8080 --env-file .env zoo-booking:1.0
```

---

## 📞 Support

For issues or questions:
1. Check logs: `http://localhost:8080/actuator/logs`
2. Review database audit: `SELECT * FROM booking_audit`
3. Check Swagger docs: `http://localhost:8080/swagger-ui/index.html`
4. Read implementation guide: `PRODUCTION_BOOKING_SYSTEM.md`

---

**Build Status:** ✅ READY FOR TESTING & DEPLOYMENT

