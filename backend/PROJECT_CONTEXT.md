# Zoo Booking System - Project Analysis & Context

## 📋 Project Overview

**Zoo Booking System** is a comprehensive Spring Boot application designed for managing zoo ticket bookings with modern web technologies, secure authentication, and automated ticket generation.

## 🏗️ Architecture & Technology Stack

### **Backend Framework**
- **Spring Boot 4.0.5** - Main application framework
- **Java 17** - Programming language
- **Maven** - Build and dependency management

### **Core Technologies**
- **Spring Security** - Authentication & Authorization
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Spring Data JPA** - Database access layer
- **PostgreSQL** - Primary database
- **H2 Database** - Alternative/test database

### **Additional Features**
- **Swagger/OpenAPI 3.0** - API documentation
- **iText PDF** - Ticket generation
- **ZXing** - QR code generation
- **Lombok** - Code generation
- **Docker** - Containerization support

## 📊 Data Model Analysis

### **Core Entities**

#### **User Entity**
```java
@Table(name = "users")
- id: Long (Primary Key)
- fullName: String
- email: String (Unique)
- password: String (Encrypted)
- mobileNumber: String
- roles: Set<Role> (Many-to-Many)
```

#### **Role Entity**
```java
@Table(name = "roles")
- id: Long (Primary Key)
- name: ERole (ROLE_USER, ROLE_ADMIN)
```

#### **Slot Entity**
```java
@Table(name = "slots")
- id: Long (Primary Key)
- slotDate: LocalDate
- startTime: LocalTime
- endTime: LocalTime
- totalCapacity: Integer
- availableCapacity: Integer
- isActive: Boolean
```

#### **Booking Entity**
```java
@Table(name = "bookings")
- id: Long (Primary Key)
- user: User (Many-to-One)
- slot: Slot (Many-to-One)
- adultTickets: Integer
- childTickets: Integer
- addOnCamera: Integer
- addOnSafari: Integer
- totalAmount: Double
- status: String (PENDING/CONFIRMED/FAILED)
- razorpayOrderId: String
- razorpayPaymentId: String
- qrCodeUrl: String
- pdfUrl: String
- createdAt: LocalDateTime
```

## 🔐 Security Architecture

### **Authentication Flow**
1. **Registration**: User signs up with email/password
2. **Login**: User authenticates and receives JWT token
3. **Authorization**: JWT token required for protected endpoints

### **Role-Based Access Control**
- **ROLE_USER**: Basic booking operations
- **ROLE_ADMIN**: Slot management + all user permissions

### **Security Configuration**
- **JWT Expiration**: 24 hours
- **Password Encryption**: BCrypt
- **CORS**: Enabled for cross-origin requests
- **CSRF**: Disabled (stateless API)

## 📡 API Endpoints Analysis

### **Authentication Controller** (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signin` | ❌ | User login |
| POST | `/signup` | ❌ | User registration |

### **Slot Controller** (`/api/slots`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/available?date=YYYY-MM-DD` | ❌ | - | Get available slots |
| POST | `/` | ✅ | ADMIN | Create new slot |
| PUT | `/{id}` | ✅ | ADMIN | Update slot |

### **Booking Controller** (`/api/bookings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/initiate` | ✅ | Create booking |
| POST | `/confirm/{id}` | ✅ | Confirm payment |
| GET | `/my-bookings` | ✅ | Get user bookings |

## 🔍 Key Business Logic

### **Booking Flow**
1. **Check Availability**: Verify slot capacity
2. **Reserve Capacity**: Deduct from available slots
3. **Payment Integration**: Razorpay order creation
4. **Confirmation**: Update status + generate ticket
5. **Ticket Generation**: PDF with QR code

### **Capacity Management**
- **Total Capacity**: Fixed per slot
- **Available Capacity**: Dynamic (total - booked)
- **Atomic Operations**: Prevents overbooking

## 📋 Questions for Project Enhancement

### **1. Business Logic Questions**
- **Q1**: How is the pricing calculated? (adultTickets, childTickets, addOns)
- **Q2**: What happens if a booking fails after capacity deduction?
- **Q3**: Are there different pricing tiers for different time slots?
- **Q4**: How are add-on services (camera, safari) priced and managed?

### **2. Technical Architecture Questions**
- **Q5**: Why both PostgreSQL and H2 dependencies? Which is primary?
- **Q6**: How are PDF tickets served? Static file serving or database storage?
- **Q7**: What's the QR code content structure? Just booking ID?
- **Q8**: How is timezone handling managed across the application?

### **3. Security & Performance Questions**
- **Q9**: What's the JWT refresh token strategy?
- **Q10**: How are concurrent booking conflicts handled?
- **Q11**: What's the rate limiting strategy for booking endpoints?
- **Q12**: How are failed payments and orphaned bookings cleaned up?

### **4. Integration Questions**
- **Q13**: Is Razorpay fully integrated or just mock implementation?
- **Q14**: How are email notifications handled for bookings?
- **Q15**: Is there a frontend application that consumes this API?
- **Q16**: How are analytics/reporting handled for admin users?

### **5. Scalability Questions**
- **Q17**: What's the expected concurrent user load?
- **Q18**: How are database connections pooled?
- **Q19**: Is there caching implemented for frequently accessed data?
- **Q20**: How are logs and monitoring handled?

## 🚀 Recommended Enhancements

### **High Priority**
1. **Error Handling**: Comprehensive exception handling with proper HTTP status codes
2. **Input Validation**: Enhanced validation for booking requests
3. **Transaction Management**: Ensure atomicity in booking operations
4. **Logging**: Structured logging for business operations

### **Medium Priority**
5. **Caching**: Redis for slot availability and user sessions
6. **Email Service**: Booking confirmations and notifications
7. **Admin Dashboard**: Slot management and booking analytics
8. **Payment Webhooks**: Real Razorpay integration

### **Low Priority**
9. **Multi-language Support**: Internationalization
10. **API Versioning**: Version management for endpoints
11. **Rate Limiting**: Prevent abuse and ensure fair usage
12. **Audit Logging**: Track all booking and admin operations

## 📁 Project Structure Summary

```
zoo-booking-backend/
├── src/main/java/com/zoo/booking/
│   ├── BackendApplication.java          # Main Spring Boot application
│   ├── config/
│   │   └── OpenApiConfig.java           # Swagger configuration
│   ├── controller/
│   │   ├── AuthController.java          # Authentication endpoints
│   │   ├── BookingController.java       # Booking management
│   │   └── SlotController.java          # Slot management
│   ├── entity/
│   │   ├── Booking.java                 # Booking entity
│   │   ├── ERole.java                   # Role enum
│   │   ├── Role.java                    # Role entity
│   │   ├── Slot.java                    # Time slot entity
│   │   └── User.java                    # User entity
│   ├── payload/
│   │   ├── request/
│   │   │   ├── LoginRequest.java        # Login DTO
│   │   │   └── SignupRequest.java       # Registration DTO
│   │   └── response/
│   │       ├── JwtResponse.java         # Auth response
│   │       └── MessageResponse.java     # Generic response
│   ├── repository/
│   │   ├── BookingRepository.java       # Booking data access
│   │   ├── RoleRepository.java          # Role data access
│   │   ├── SlotRepository.java          # Slot data access
│   │   └── UserRepository.java          # User data access
│   ├── security/
│   │   ├── WebSecurityConfig.java       # Security configuration
│   │   ├── jwt/
│   │   │   ├── AuthEntryPointJwt.java   # JWT auth entry point
│   │   │   ├── AuthTokenFilter.java     # JWT token filter
│   │   │   └── JwtUtils.java            # JWT utilities
│   │   └── services/
│   │       ├── UserDetailsImpl.java     # User details implementation
│   │       └── UserDetailsServiceImpl.java # User details service
│   └── service/
│       └── TicketService.java           # PDF/QR ticket generation
├── src/main/resources/
│   ├── application.properties           # Application configuration
│   └── data.sql                         # Database initialization
├── API_GUIDE.md                         # API documentation guide
└── pom.xml                              # Maven configuration
```

## 🎯 Current Status

### **✅ Completed Features**
- User authentication with JWT
- Role-based access control
- Slot availability management
- Booking creation and confirmation
- PDF ticket generation with QR codes
- Swagger API documentation
- CORS configuration
- Database schema with relationships

### **⚠️ Areas Needing Attention**
- Payment integration (currently mock)
- Error handling consistency
- Input validation completeness
- Transaction management
- Logging and monitoring

## 🔗 Integration Points

### **External Services**
- **Razorpay**: Payment processing (mock implementation)
- **Email Service**: Notifications (not implemented)
- **File Storage**: Ticket PDFs (local file system)

### **Database**
- **PostgreSQL**: Production database
- **H2**: Development/testing database

This comprehensive analysis provides a solid foundation for understanding, maintaining, and extending the Zoo Booking System.
