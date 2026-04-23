# Microservices Migration Plan: Zoo Booking System

This plan outlines the transition from the current Spring Boot monolith to a scalable, distributed microservices architecture tailored for high traffic and reliability.

## User Review Required

> [!IMPORTANT]
> Migrating to microservices increases operational complexity. We will need to manage multiple databases and inter-service communication. Please confirm if we should proceed with **RabbitMQ** or **Kafka** for asynchronous messaging.

## Architectural Roadmap

### Phase 1: Service Decomposition (Domain Driven Design)

We will split the monolith into specialized services, each with its own database:

| Service Name | Responsibility | Primary Tech |
| :--- | :--- | :--- |
| **Identity Service** | Auth, JWT, Dynamic RBAC, Menu Permissions | Spring Security, **NamedParameterJdbcTemplate**, PostgreSQL |
| **Inventory Service** | Slots, Capacity, Zoo Timings | **NamedParameterJdbcTemplate**, PostgreSQL |
| **Booking Service** | Ticket reservations, Status flow | **NamedParameterJdbcTemplate**, PostgreSQL |
| **Payment Service** | Razorpay integration, Webhooks | **NamedParameterJdbcTemplate**, PostgreSQL |
| **Pricing Service** | Dynamic/Surge pricing logic | Spring Boot |
| **Notification Service** | Email/SMS alerts (Asynchronous) | Spring Mail, RabbitMQ |

### Identity Service Deep Dive (RBAC)

We will implement a high-performance permission system using **NamedParameterJdbcTemplate**:
1. **MenuItemList**: `id`, `label`, `path`, `icon`, `parent_id`, `sequence`.
2. **RoleMaster**: `id`, `name` (Enum), `code` (String).
3. **PermissionsMaster**: `id`, `name`, `code` (e.g., `EDIT_PRICING`).
4. **RolePermissionsMapping**: Links Roles to Permissions.
5. **PermissionMenuMapping**: Links Permissions to MenuItems.

This three-tier approach (Role -> Permission -> Menu) provides maximum flexibility for complex organizational structures.


### Phase 2: Core Infrastructure Setup

1.  **API Gateway**: Implement **Spring Cloud Gateway** to handle routing, CORS, and cross-cutting concerns like security.
2.  **Service Discovery**: Deploy **Netflix Eureka** server so services can find each other dynamically.
3.  **Centralized Config**: Use **Spring Cloud Config** to manage `.properties` across all services from a single Git repo.

### Phase 3: Communication Strategy

*   **Synchronous (REST/gRPC)**: Used when a service needs an immediate answer (e.g., Booking Service calling Pricing Service).
*   **Asynchronous (Event-Driven)**: Used for non-blocking tasks.
    *   *Example*: `Booking Service` emits a `BOOKING_CONFIRMED` event.
    *   `Notification Service` and `Payment Service` consume this event independently.

### Phase 4: Data Consistency (Saga Pattern)

Since each service has its own DB, we will implement the **Saga Pattern** (Choreography-based) to handle distributed transactions (e.g., rolling back a booking if payment fails).

---

## Proposed Changes

### [Identity Service] [NEW]
- Extract user and security logic from current monolith.
- Implement `/api/auth` endpoints.

### [Inventory Service] [NEW]
- Extract slot management logic.
- Implement `/api/slots` endpoints.

### [API Gateway] [NEW]
- Configure routes for all services.
- Move JWT validation to the Gateway level for performance.

---

## Verification Plan

### Automated Tests
- **Contract Testing**: Ensure API changes in one service don't break others.
- **Integration Tests**: Verify the full booking flow through the Gateway.

### Manual Verification
- Deploy services using **Docker Compose**.
- Verify that killing one service (e.g., Notification) doesn't stop the Booking service.
