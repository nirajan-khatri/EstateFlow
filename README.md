# Property Inspection & Task Management Dashboard

A production-style full-stack application for managing property inspections and tasks.

## 📖 Overview

This system allows employees to report property issues (broken lights, plumbing, etc.) and managers to track, assign, and resolve them. It features a comprehensive dashboard for analytics and a streamlined workflow for issue management.

## 🏗 Architecture

The project follows a monorepo structure:

```text
property-management/
├── server/         # Node.js + Express + TypeScript Backend
├── client/         # Angular + Ng-Zorro Frontend
├── docker-compose.yml # Docker Compose configuration
└── README.md       # This file
```

### Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma (ORM), PostgreSQL
- **Frontend**: Angular, Ng-Zorro (Ant Design), RxJS
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

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

## 📂 Project Structure

### Server (`/server`)
- `src/controllers`: Request handlers
- `src/routes`: API route definitions
- `src/middleware`: Auth, error handling, upload middleware
- `src/services`: Business logic
- `prisma/`: Database schema and migrations

### Client (`/client`)
- `src/app/pages`: Main view components (Login, Dashboard, Issues)
- `src/app/components`: Reusable UI components
- `src/app/services`: API integration services
- `src/app/guards`: Route protection guards

## 📅 Development Roadmap

- **Day 1**: Blueprint & Setup
- **Day 2**: Database & Backend Structure
- **Day 3**: Authentication
- **Day 4**: Issue Reporting
- **Day 5**: Manager Dashboard
- **Day 6**: Analytics
- **Day 7**: Polish & Deploy
