# Wasel Palestine Backend

## Description
Wasel Palestine is a backend system built with NestJS to support incident reporting, community reports, checkpoint updates, route estimation, alerts, and authentication.

## Main Features
- JWT Authentication
- Incident management
- Reports management
- Maps and route estimation
- Checkpoints module
- Weather integration
- Alerts and subscriptions
- Validation and abuse prevention

## Technologies Used
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- k6 for performance testing

## Project Structure
- `src/auth` → authentication and authorization
- `src/incidents` → incidents endpoints and logic
- `src/reports` → reports endpoints and voting
- `src/maps` → route estimation
- `src/checkpoints` → checkpoint status and history
- `prisma` → database schema and migrations

## API Modules
- `/api/v1/auth`
- `/api/v1/incidents`
- `/api/v1/reports`
- `/api/v1/maps`
- `/api/v1/checkpoints`
- `/api/v1/weather`
- `/api/v1/alerts`
- `/api/v1/subscriptions`

## Abuse Prevention
- Duplicate report detection
- Vote protection
- DTO validation
- Request validation with `ValidationPipe`

## External API Handling
- Timeout support
- Error handling
- Basic caching for route requests

## Performance Testing (k6)
- Read-heavy: tested `GET /incidents` with 10 virtual users for 10 seconds, 100% success rate.
- Write-heavy: tested protected POST endpoints using valid JWT token.
- Mixed: tested read and write operations together.
- Spike: tested sudden increase in traffic.
- Soak: tested system stability over longer duration.

## How to Run
```bash
npm install
npm run start:dev

