# Wasel Palestine Backend

## System Overview
Wasel Palestine is a backend API system designed to support smart mobility and checkpoint intelligence in Palestine.

The platform provides structured and reliable data about incidents, checkpoints, routes, alerts, reports, and contextual information such as weather.

This project focuses on backend engineering only, including:
- RESTful API design
- Relational database modeling
- Authentication and authorization
- External API integration
- Performance testing
- Reliability and maintainability

---

## Technology Stack
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- JWT Authentication
- k6 for performance testing

---

## Main Features

### Authentication
- Login & Register
- JWT tokens (access + refresh)
- Protected routes

### Incidents & Checkpoints
- Manage incidents
- Track checkpoints
- Filtering & pagination

### Reports
- Users submit reports
- Validation & duplicate detection

### Routes
- Distance & duration estimation
- Avoid checkpoints

### Alerts
- Subscriptions by area
- Alert system ready

### External APIs
- Weather API
- Routing API

---

## API Design

All endpoints follow:

/api/v1/

### Main Modules
- /auth
- /incidents
- /reports
- /maps
- /checkpoints
- /weather
- /alerts
- /subscriptions

### Design Goals
- Modular
- Versioned
- Easy to use
- Secure with JWT

---

## Database (ERD)

User:
- id, name, email, password, role

Report:
- id, category, location, description, createdAt, userId

Incident:
- id, title, description, category, severity, status, location, createdAt

Checkpoint:
- id, name, location, status

CheckpointHistory:
- id, checkpointId, oldStatus, newStatus, changedAt

Subscription:
- id, userId, area, incidentCategory

Alert:
- id, userId, incidentId, createdAt

---

## Architecture

- Controllers → handle requests
- Services → business logic
- Prisma → database
- Modules → structure

---

## External APIs

Routing API:
- distance
- duration

Weather API:
- environmental data

---

## Validation
- DTO validation
- duplicate detection
- request validation

---

## Authentication
- JWT based
- Access + Refresh tokens

Header:
Authorization: Bearer <token>

---

## Testing

### API Testing
- API-Dog

### Performance Testing (k6)

Read Test:
- GET /incidents
- 10 users
- 10 seconds
- 100% success

Write Test:
- POST /reports
- with valid token

Other:
- Mixed load
- Spike test
- Soak test

---

## Performance Notes
- Stable performance
- No errors in read
- Fixed token issues
- Caching improved speed

---

## Project Structure

src/
- auth/
- incidents/
- reports/
- maps/
- checkpoints/
- weather/

prisma/
test/

---

## Run Project

npm install  
npm run start:dev  

---

## Docker
- Dockerfile
- docker-compose.yaml

---

## Git Workflow
- GitHub repo
- main branch
- commits tracked

---

## Notes
Course project – Spring 2026

---

## Team Work
- API development
- Database design
- Testing
- Documentation