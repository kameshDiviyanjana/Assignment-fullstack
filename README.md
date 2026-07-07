# Backend Setup

The backend application is built using **Node.js** with **PostgreSQL** as the database. Prisma ORM is used for database management.

## Initial Setup

First, create a `.env` file in the root folder and configure the required environment variables.

Then install all project dependencies:

```bash
npm install
```

---

# 1. Dependency Installation

Install required dependencies:

```bash
npm install
```

---

# 2. Database Setup

The application uses **PostgreSQL with Prisma ORM**.

Run the following commands to set up the database:

```bash
npx prisma migrate reset
npx prisma generate
npx prisma db seed
npm run dev
```

---

# 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<Password>
DATABASE_NAME=<Databasename>


NODE_ENV=development

FRONTEND_URL=http://localhost:5173

SECRET_KEY=yowpdkdndayhgddmadlad55699

JWT_SECRET=dwwwewewewfffalafladsdlsdlsdld

REFRESH_SECRET=dwwwewesdsdyrsdgalmdpdpadpsdlsdld

DATABASE_URL=postgres://postgres:<Password>@localhost:5432/<Databasename>
```

---

# Architecture Overview

The backend follows **Clean Architecture principles with the Repository Pattern**.

## Project Structure

```
src/
│
├── config/          # Database and Express configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication and request validation
├── models/          # Prisma database models
├── routes/          # API route definitions
├── repositories/    # Database access layer
├── services/        # Business logic layer
├── utils/           # Helper functions and utilities
│
└── app.ts           # Main application entry point
```

---

# API Endpoints

## Authentication APIs

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/register`        | Register a new user    |
| POST   | `/auth/login`           | User login             |
| POST   | `/auth/refresh`         | Refresh access token   |
| POST   | `/auth/logout`          | Logout user            |
| POST   | `/auth/verify`          | Verify user account    |
| POST   | `/auth/forgot-password` | Request password reset |
| POST   | `/auth/reset-password`  | Reset user password    |

---

## Task APIs

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| POST   | `/tasks`     | Create a new task |
| GET    | `/tasks`     | Get all tasks     |
| GET    | `/tasks/:id` | Get task by ID    |
| PUT    | `/tasks/:id` | Update task       |
| DELETE | `/tasks/:id` | Delete task       |

---

## User APIs

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/users/:userId/tasks` | Get tasks assigned to a user |

---

# Key Implementation Decisions

## Authentication & Authorization

Implemented secure authentication using JWT-based authentication.

Supported roles:

* **User**
* **Admin**

Role-based authorization is used to control access to protected resources.

---

# Assumptions Made During Development

1. Prisma ORM is used as the database management and query layer.
2. PostgreSQL is used as the primary database.
3. JWT tokens are used for access and refresh token management.

---

# Future Improvements

1. Add task history tracking
2. Implement notification system
3. Add task assignment functionality
4. Introduce team management features
5. Add project management functionality

