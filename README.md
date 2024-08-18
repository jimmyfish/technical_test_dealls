# Technical Test

This project is built using NestJS, Prisma, and Snaplet. It provides a robust backend API with a PostgreSQL database.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Migrations](#database-migrations)
- [Development](#development)
- [Staging/Production](#stagingproduction)
- [Testing](#testing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   $ git clone git@github.com:jimmyfish/technical_test_dealls.git
   $ cd technical_test_dealls
   ```

2. **Install dependencies:**

   ```bash
   $ npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for required variables.

## Configuration

- **NestJS**: The main framework for building the API.
- **Prisma**: ORM for interacting with the PostgreSQL database.
- **Snaplet**: Used for generating and managing seed data.

### Example `.env` configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SNAPLET_ENVIRONMENT=development
```

## Database Migrations

### Running Migrations

1. **Apply existing migrations:**

   ```bash
   $ npx prisma migrate deploy
   ```

## Development

1. **Sync Snaplet seed:**

   ```bash
   $ npx @snaplet/seed sync
   ```

2. **Apply Snaplet seed**

   ```bash
   $ npx tsx prisma/seed/seed.ts
   ```

3. **Run the development server:**

   ```bash
   $ npm run start:dev
   ```

## Staging/Production

1. **Apply migrations:**

   Ensure that migrations are applied before deploying:

   ```bash
   npx prisma migrate deploy
   ```

2. **Run the server in production mode:**

   ```bash
   npm run start:prod
   ```

3. **Apply Snaplet snapshot for production:**

   ```bash
   npx snaplet snapshot apply --environment=production
   ```

## Testing

1. **Run tests:**

   ```bash
   npm run test
   ```

## Directory Structure
```
.   
├── prisma   
│ ├── migrations   
│ │ └── 20240817175226_init // contain migration file   
│ └── seed   
├── src   
│ ├── common   
│ │ ├── auth // auth related file   
│ │ ├── constants // contains constants   
│ │ ├── filters   
│ │ ├── helpers // contains helper file   
│ │ └── zod   
│ ├── config   
│ │ ├── app // configuration of app   
│ │ └── database   
│ │     └── prisma // configuration of database   
│ └── modules   
│     └── v1   
│         ├── auth // contain auth module file   
│         └── user // contain user module file   
└── test   

```


