# 🔐 Admin Credentials Reference

## Default Admin Login

**Email:** `sa@zoo.com`  
**Password:** `sa`

---

## How to Login

### Via REST API (Postman/cURL)
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sa@zoo.com",
    "password": "sa"
  }'
```

### Via Web Application
1. Navigate to: `http://localhost:3000`
2. Click "Sign In"
3. Enter:
   - Email: `sa@zoo.com`
   - Password: `sa`
4. Click "Continue to Portal"

---

## Admin Features Available

After logging in as admin, you can:

- ✅ Create and manage booking slots
- ✅ View all bookings
- ✅ Manage user accounts
- ✅ View revenue analytics
- ✅ Configure pricing
- ✅ Access admin dashboard

---

## Test Users (for reference)

| Email | Password | Role |
|-------|----------|------|
| sa@zoo.com | sa | Admin |
| priya@email.com | password | User |
| rahul@email.com | password | User |

---

## Security Notes

- All passwords are encrypted using BCrypt (10 rounds)
- Change default credentials in production environment
- Update in: `src/main/resources/data.sql`
- To generate new password hash:
  ```bash
  python -c "
  import bcrypt
  password = b'your_new_password'
  print(bcrypt.hashpw(password, bcrypt.gensalt(rounds=10)).decode('utf-8'))
  "
  ```


