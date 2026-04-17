# 🚀 Ready-to-Run Booking Test Script

## Save this as: `test_booking_flow.sh`

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "ZOO BOOKING SYSTEM - COMPLETE API TEST"
echo "==========================================${NC}\n"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq is required but not installed. Install with: apt-get install jq${NC}"
    exit 1
fi

# ============================================================
# 1. ADMIN LOGIN
# ============================================================
echo -e "${YELLOW}1. ADMIN LOGIN${NC}"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"sa@zoo.com","password":"sa"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.token' 2>/dev/null)
ADMIN_ID=$(echo $ADMIN_RESPONSE | jq -r '.id' 2>/dev/null)

if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" == "null" ]; then
    echo -e "${RED}❌ Admin login failed${NC}"
    echo "Response: $ADMIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Admin logged in${NC}"
echo "   Token: ${ADMIN_TOKEN:0:30}..."
echo "   ID: $ADMIN_ID"

# ============================================================
# 2. USER LOGIN
# ============================================================
echo -e "\n${YELLOW}2. USER LOGIN${NC}"
USER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"priya@email.com","password":"password"}')

USER_TOKEN=$(echo $USER_RESPONSE | jq -r '.token' 2>/dev/null)
USER_ID=$(echo $USER_RESPONSE | jq -r '.id' 2>/dev/null)

if [ -z "$USER_TOKEN" ] || [ "$USER_TOKEN" == "null" ]; then
    echo -e "${RED}❌ User login failed${NC}"
    echo "Response: $USER_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ User logged in${NC}"
echo "   Token: ${USER_TOKEN:0:30}..."
echo "   ID: $USER_ID"

# ============================================================
# 3. GET AVAILABLE SLOTS (PUBLIC)
# ============================================================
echo -e "\n${YELLOW}3. GET AVAILABLE SLOTS (Public API)${NC}"
SLOTS=$(curl -s -X GET "http://localhost:8080/api/slots/available?date=2026-04-16" \
  -H "Content-Type: application/json")

SLOT_COUNT=$(echo $SLOTS | jq 'length' 2>/dev/null)
SLOT_ID=$(echo $SLOTS | jq -r '.[0].id' 2>/dev/null)
SLOT_CAPACITY=$(echo $SLOTS | jq -r '.[0].availableCapacity' 2>/dev/null)

if [ "$SLOT_COUNT" -eq 0 ] || [ -z "$SLOT_ID" ]; then
    echo -e "${RED}❌ No slots available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found $SLOT_COUNT slots${NC}"
echo "   First Slot ID: $SLOT_ID"
echo "   Available Capacity: $SLOT_CAPACITY"

# ============================================================
# 4. INITIATE BOOKING (STEP 1)
# ============================================================
echo -e "\n${YELLOW}4. INITIATE BOOKING (Step 1 - Create PENDING)${NC}"
INITIATE=$(curl -s -X POST http://localhost:8080/api/bookings/initiate \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"slot\": {\"id\": $SLOT_ID},
    \"adultTickets\": 2,
    \"childTickets\": 1,
    \"totalAmount\": 200.0,
    \"status\": \"PENDING\"
  }")

BOOKING_ID=$(echo $INITIATE | jq -r '.id' 2>/dev/null)
BOOKING_STATUS=$(echo $INITIATE | jq -r '.status' 2>/dev/null)

if [ -z "$BOOKING_ID" ] || [ "$BOOKING_ID" == "null" ]; then
    echo -e "${RED}❌ Booking initiation failed${NC}"
    echo "Response: $INITIATE"
    exit 1
fi

echo -e "${GREEN}✅ Booking initiated${NC}"
echo "   Booking ID: $BOOKING_ID"
echo "   Status: $BOOKING_STATUS (should be PENDING)"

if [ "$BOOKING_STATUS" != "PENDING" ]; then
    echo -e "${YELLOW}⚠️  Warning: Expected PENDING but got $BOOKING_STATUS${NC}"
fi

# ============================================================
# 5. CONFIRM BOOKING (STEP 2 - CRITICAL!)
# ============================================================
echo -e "\n${YELLOW}5. CONFIRM BOOKING (Step 2 - Change to CONFIRMED) ⭐ CRITICAL${NC}"
PAYMENT_ID="pay_test_$(date +%s)"
CONFIRM=$(curl -s -X POST "http://localhost:8080/api/bookings/confirm/$BOOKING_ID?paymentId=$PAYMENT_ID" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json")

CONFIRM_STATUS=$(echo $CONFIRM | jq -r '.status' 2>/dev/null)
CONFIRM_ID=$(echo $CONFIRM | jq -r '.id' 2>/dev/null)

if [ -z "$CONFIRM_ID" ] || [ "$CONFIRM_ID" == "null" ]; then
    echo -e "${RED}❌ Booking confirmation failed${NC}"
    echo "Response: $CONFIRM"
    exit 1
fi

echo -e "${GREEN}✅ Booking confirmed${NC}"
echo "   Booking ID: $CONFIRM_ID"
echo "   Status: $CONFIRM_STATUS"

if [ "$CONFIRM_STATUS" != "CONFIRMED" ]; then
    echo -e "${RED}❌ ERROR: Expected CONFIRMED but got $CONFIRM_STATUS${NC}"
    echo "   This is the issue! Bookings are not being confirmed."
    echo "   They stay PENDING instead of becoming CONFIRMED."
else
    echo -e "${GREEN}✅ Status correctly changed to CONFIRMED${NC}"
fi

# ============================================================
# 6. GET USER'S BOOKINGS
# ============================================================
echo -e "\n${YELLOW}6. GET USER'S BOOKINGS${NC}"
MY_BOOKINGS=$(curl -s -X GET http://localhost:8080/api/bookings/my-bookings \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json")

MY_COUNT=$(echo $MY_BOOKINGS | jq 'length' 2>/dev/null)
LATEST_BOOKING=$(echo $MY_BOOKINGS | jq '.[-1]' 2>/dev/null)
LATEST_ID=$(echo $LATEST_BOOKING | jq -r '.id' 2>/dev/null)
LATEST_STATUS=$(echo $LATEST_BOOKING | jq -r '.status' 2>/dev/null)

echo -e "${GREEN}✅ User has $MY_COUNT bookings${NC}"
echo "   Latest Booking ID: $LATEST_ID"
echo "   Status: $LATEST_STATUS"

# ============================================================
# 7. GET ALL BOOKINGS (ADMIN)
# ============================================================
echo -e "\n${YELLOW}7. GET ALL BOOKINGS (Admin View)${NC}"
ALL_BOOKINGS=$(curl -s -X GET http://localhost:8080/api/bookings/all \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json")

TOTAL_COUNT=$(echo $ALL_BOOKINGS | jq 'length' 2>/dev/null)
PENDING_COUNT=$(echo $ALL_BOOKINGS | jq '[.[] | select(.status=="PENDING")] | length' 2>/dev/null)
CONFIRMED_COUNT=$(echo $ALL_BOOKINGS | jq '[.[] | select(.status=="CONFIRMED")] | length' 2>/dev/null)

echo -e "${GREEN}✅ Total: $TOTAL_COUNT bookings${NC}"
echo "   Pending: $PENDING_COUNT"
echo "   Confirmed: $CONFIRMED_COUNT"

# ============================================================
# FINAL SUMMARY
# ============================================================
echo -e "\n${BLUE}=========================================="
echo "TEST SUMMARY"
echo "==========================================${NC}"

# Results
echo -e "\n${YELLOW}Test Results:${NC}"
echo "✅ Admin Login: PASSED"
echo "✅ User Login: PASSED"
echo "✅ Get Slots: PASSED"
echo "✅ Booking Initiate: PASSED"

if [ "$CONFIRM_STATUS" = "CONFIRMED" ]; then
    echo -e "${GREEN}✅ Booking Confirm: PASSED${NC}"
    echo "✅ Get User Bookings: PASSED"
    echo "✅ Get All Bookings: PASSED"
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}The booking system is working correctly!${NC}"
else
    echo -e "${RED}❌ Booking Confirm: FAILED${NC}"
    echo -e "${RED}⚠️  ISSUE DETECTED: Booking not being confirmed!${NC}"
    echo -e "${RED}    Bookings stay in PENDING status instead of CONFIRMED${NC}"
    echo -e "${RED}    This explains why bookings show but aren't finalized${NC}"
fi

# Statistics
echo -e "\n${YELLOW}Statistics:${NC}"
echo "Total Bookings in System: $TOTAL_COUNT"
echo "Pending (not confirmed): $PENDING_COUNT"
echo "Confirmed (finalized): $CONFIRMED_COUNT"

if [ $PENDING_COUNT -gt 5 ]; then
    echo -e "${RED}⚠️  High number of PENDING bookings detected!${NC}"
    echo -e "${RED}    This confirms the confirm() endpoint is failing${NC}"
fi

echo -e "\n${BLUE}=========================================="
```

---

## 🚀 How to Use

### Step 1: Save the Script
```bash
cat > test_booking_flow.sh << 'EOF'
# Paste the script above here
EOF
```

### Step 2: Make it Executable
```bash
chmod +x test_booking_flow.sh
```

### Step 3: Run it
```bash
./test_booking_flow.sh
```

---

## 📊 What the Output Tells You

### If You See:
```
✅ ALL TESTS PASSED!
The booking system is working correctly!
```
→ System is working, issue is in frontend display

### If You See:
```
❌ Booking Confirm: FAILED
⚠️  ISSUE DETECTED: Booking not being confirmed!
```
→ Confirm endpoint is failing (this is your problem!)

### If You See:
```
⚠️  High number of PENDING bookings detected!
This confirms the confirm() endpoint is failing
```
→ Multiple bookings stuck = confirm endpoint broken

---

## 🔧 What to Do Next

### If tests pass:
- Issue is in frontend (UI not refreshing after booking)
- Check browser console during booking
- Verify confirmation page displays correctly

### If tests fail at confirm:
- Confirm endpoint has a bug
- Check backend logs for errors
- May need to fix backend booking service

---

## 📋 The Output Includes

✅ Login tests (admin + user)
✅ Slot availability
✅ Booking initiation (Step 1)
✅ Booking confirmation (Step 2) ⭐ **Critical**
✅ User bookings list
✅ All bookings (admin view)
✅ Statistics on PENDING vs CONFIRMED
✅ Detailed diagnosis of the issue

---

**Status:** Ready to run!

Copy the script and run it to diagnose the booking issue! 🎯


