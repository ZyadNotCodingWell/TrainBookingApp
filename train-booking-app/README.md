# Train Booking App

A Next.js application for booking train tickets with Prisma and PostgreSQL.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your PostgreSQL database and update `.env` with your `DATABASE_URL`.

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database:
   ```bash
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- User registration and authentication
- Train search by departure and arrival cities
- Booking tickets with seat management
- Account number-based discounts
- View booking history

## API Endpoints

- `GET /api/trains?departureCity=X&arrivalCity=Y&date=Z` - Search trains
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get user bookings
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

## Database Schema

- **User**: email, passwordHash, accountNumber, bookings
- **Train**: id, departureCity, arrivalCity, departureDate, departureHour, price, remainingPlaces, bookings
- **Booking**: id, userEmail, trainId, seats, totalPrice, createdAt, user, train
