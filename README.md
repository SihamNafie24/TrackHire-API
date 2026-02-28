# TrackHire API 

Professional RESTful Job Application Tracker API built with Node.js, TypeScript, and PostgreSQL.

##  Features

- **Secure Authentication**: JWT-based login and registration with Bcrypt hashing.
- **Role-Based Access Control (RBAC)**:
  - `USER`: View jobs, apply to jobs, and track personal application status.
  - `ADMIN`: Full CRUD on jobs, manage all applications and their statuses.
- **Job Management**: Advanced search, filtering by company/location, and pagination.
- **Application Tracking**: Prevention of duplicate applications and state management (Applied, Interview, Accepted, Rejected).
- **Interactive API Docs**: Fully documented with Swagger UI.
- **Developer Ready**: Docker and Docker Compose support, clean architecture, and type-safety with TypeScript & Zod.

##  Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: Swagger (OpenAPI 3.0)
- **Containerization**: Docker & Docker Compose

##  Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Docker)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SihamNafie24/TrackHire-API.git
   cd TrackHire-API
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/trackhire_db?schema=public"
   JWT_SECRET="your_secret_key"
   NODE_ENV=development
   ```

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev --name init --schema=src/prisma/schema.prisma
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

##  API Documentation

Once the server is running, visit:
`http://localhost:5000/api-docs`

Use the interactive dashboard to test registration, login, and all other endpoints.

##  Running with Docker

```bash
# Start the database and app
docker-compose up --build
```

##  Project Structure

```text
src/
 ├── controllers/    # Request handlers
 ├── services/       # Business logic
 ├── routes/         # API Route definitions
 ├── middlewares/    # Auth, Validation, Error Handling
 ├── prisma/         # Database schema & client
 ├── utils/          # Helpers, Schemas, Swagger JSON
 ├── app.ts          # Express application setup
 └── server.ts       # Server entry point
```

##  License
ISC © 2026 Siham Nafie - All rights reserved.
