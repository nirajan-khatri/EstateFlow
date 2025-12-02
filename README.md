# EstateFlow - Property Management System

A production-ready full-stack application for managing property inspections and tasks, featuring real-time updates and comprehensive analytics.

## 📖 Overview

EstateFlow streamlines the property management workflow by allowing employees to report issues (maintenance, repairs, etc.) and managers to track, assign, and resolve them efficiently. The system is built with a modern tech stack and emphasizes performance, scalability, and user experience.

## ✨ Key Features

-   **Role-Based Access Control**: Distinct dashboards for Employees (Reporters) and Managers (Admins).
-   **Real-Time Updates**: Instant notifications for issue assignment and status changes using Socket.IO.
-   **Interactive Analytics**: Visual insights into issue status and priority distribution.
-   **Issue Management**: Create, assign, update, and track issues with rich details and image support.
-   **API Documentation**: Full Swagger/OpenAPI documentation for backend endpoints.

## 🏗 Architecture

The project follows a monorepo structure:

```text
estate-flow/
├── server/         # Node.js + Express + TypeScript Backend
├── client/         # Angular + Ng-Zorro Frontend
├── docker-compose.yml # Docker Compose configuration
└── README.md       # This file
```

### Tech Stack

-   **Backend**: Node.js, Express, TypeScript, Prisma (ORM), PostgreSQL
-   **Frontend**: Angular 18, Ng-Zorro (Ant Design), RxJS, Signals
-   **Real-Time**: Socket.IO
-   **Database**: PostgreSQL
-   **Authentication**: JWT (JSON Web Tokens)
-   **Documentation**: Swagger (OpenAPI)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   Docker & Docker Compose

### Installation

1.  **Clone the repository**
2.  **Install dependencies**
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```
3.  **Start the Database**
    ```bash
    docker-compose up -d
    ```
4.  **Run the Backend**
    ```bash
    cd server && npm run dev
    ```
5.  **Run the Frontend**
    ```bash
    cd client && npm start
    ```

### API Documentation

Once the server is running, access the interactive API documentation at:
**`http://localhost:3000/api-docs`**

## 📂 Project Structure

### Server (`/server`)
-   `src/config`: Configuration (Swagger, DB)
-   `src/controllers`: Request handlers
-   `src/routes`: API route definitions
-   `src/middleware`: Auth, error handling, validation
-   `src/services`: Business logic
-   `src/dtos`: Data Transfer Objects
-   `prisma/`: Database schema and migrations

### Client (`/client`)
-   `src/app/core`: Singleton services, guards, interceptors
-   `src/app/shared`: Reusable components, pipes, directives
-   `src/app/pages`: Feature modules (Dashboard, Issues, Auth)
-   `src/app/models`: TypeScript interfaces

## 🧪 Testing

### Backend
(Coming Soon)

### Frontend
Run unit tests with Karma/Jasmine:
```bash
cd client && npm test
```
