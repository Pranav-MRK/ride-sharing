# 🚗 RideShare — Real-Time Ride-Sharing Platform

A ride-sharing backend built with **Node.js, Express.js, MongoDB, and Socket.io**, designed to manage rider authentication, driver and vehicle registration, ride booking, nearby-driver discovery, and real-time location updates.

The project focuses on clean backend architecture, geospatial queries, secure API design, and reliable ride lifecycle management.

## ✨ Key Features

- **Authentication & Authorization** — JWT-based authentication, password hashing with bcrypt, and role-based user management.
- **Rider Management** — Registration, login, profile retrieval, profile updates, and account deletion.
- **Driver Onboarding** — Driver profiles, driving licence details, approval status, availability, and location management.
- **Vehicle Management** — Vehicle registration details, insurance information, vehicle types, and capacity.
- **Ride Booking** — Create rides with pickup and destination coordinates.
- **Nearby Driver Discovery** — MongoDB geospatial queries using GeoJSON and `2dsphere` indexes.
- **Ride Assignment** — Atomic ride assignment to prevent multiple drivers from accepting the same ride.
- **Ride Lifecycle Management** — Track rides from searching and driver assignment through arrival, trip start, and completion.
- **Driver Availability** — Manage driver availability throughout the ride lifecycle.
- **Real-Time Communication** — Socket.io connections with JWT authentication and driver location updates.
- **Input Validation** — Joi validation for request payloads and geographic coordinates.
- **Centralized Error Handling** — Consistent error handling across API endpoints.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Persistent data storage |
| Mongoose | Schema modelling and database operations |
| Socket.io | Real-time bidirectional communication |
| JWT | Authentication |
| bcrypt | Password hashing |
| Joi | Request validation |
| Postman | API testing |

## 🏗️ Architecture

The backend follows a **layered architecture with the Repository Pattern** to separate HTTP handling, business rules, and database operations.

```text
Client / Postman
       |
       v
Express Routes
       |
       v
Middleware
(Authentication, Validation)
       |
       v
Controllers
       |
       v
Services
(Business Logic)
       |
       v
Repositories
       |
       v
MongoDB
```

Real-time communication is handled separately through Socket.io:

```text
Driver Client
     |
     v
Socket.io Server
     |
     v
Driver Service
     |
     v
Driver Repository
     |
     v
MongoDB
```

### Project Structure

```text
Backend/
├── config/
├── controller/
├── errors/
├── middleware/
├── model/
├── repositories/
├── routes/
├── services/
├── Socket/
├── utils/
├── app.js
├── package.json
└── .env
```

*Directory names may vary slightly depending on the current project structure.*

## 🚦 Ride Lifecycle

A ride progresses through controlled state transitions:

```text
requested
    |
    v
searching
    |
    v
driver_assigned
    |
    v
driver_arriving
    |
    v
started
    |
    v
completed
```

A ride can also be cancelled when its current state permits cancellation.

### Driver Assignment and Concurrency

When a driver accepts a ride, the backend uses a conditional atomic database update that checks:

- The ride exists.
- Its status is `searching`.
- No driver has already been assigned.

This prevents two concurrent requests from successfully assigning the same ride.

Driver availability is also managed across the ride lifecycle:

```text
online → busy → online
```

## 📍 Geospatial Driver Discovery

Pickup and destination locations use GeoJSON:

```json
{
  "address": "MIT ADT University, Pune",
  "location": {
    "type": "Point",
    "coordinates": [73.9412, 18.4578]
  }
}
```

Coordinates follow the GeoJSON convention:

```text
[longitude, latitude]
```

MongoDB's `2dsphere` index and geospatial queries enable location-based driver discovery. The backend can filter drivers by approval status, availability, and vehicle type.

## 🔌 API Endpoints

The following endpoints represent the core API surface. All protected endpoints require a valid bearer token.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |

### User

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/me` | Get current user profile |
| PATCH | `/api/user/me` | Update user profile |
| DELETE | `/api/user/me` | Delete user account |

### Driver

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/drivers/register` | Register driver details |
| GET | `/api/drivers/me` | Get driver profile |
| PATCH | `/api/drivers/me` | Update driver profile |
| PATCH | `/api/drivers/location` | Update driver location |
| PATCH | `/api/drivers/availability` | Update driver availability |

### Rides

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rides` | Create a ride |
| GET | `/api/rides` | Get rides for the current rider |
| GET | `/api/rides/:id` | Get ride details |
| PATCH | `/api/rides/:id/cancel` | Cancel a ride |
| GET | `/api/rides/:id/nearby-drivers` | Find nearby drivers |
| PATCH | `/api/rides/:id/accept` | Accept a ride |
| PATCH | `/api/rides/:id/arriving` | Mark driver as arriving |
| PATCH | `/api/rides/:id/start` | Start a trip |
| PATCH | `/api/rides/:id/complete` | Complete a trip |

*Verify endpoint names against your current route files before publishing.*

## ⚡ Real-Time Location Updates

Socket.io enables persistent connections between clients and the backend.

The driver authenticates using a JWT during the socket handshake and sends location updates through:

```text
driver:location:update
```

Example payload:

```json
{
  "longitude": 73.9412,
  "latitude": 18.4578
}
```

The server validates the coordinates and updates the driver's GeoJSON location and last-seen timestamp.

This provides the foundation for live driver tracking and rider-facing map updates.

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB connection URI
- Postman (recommended for API testing)

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Ride_Shareing/Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
```

Use the exact environment variable names expected by your configuration files. Never commit your actual `.env` file or secrets.

### 4. Start the server

```bash
npm run dev
```

If you use Nodemon directly:

```bash
npx nodemon app.js
```

The server should start on port `8080`, provided your environment and database connection are configured correctly.

### 5. Test the API

Open Postman and test the authentication, driver registration, ride creation, nearby-driver search, ride acceptance, and ride lifecycle endpoints.

For Socket.io testing, use the `socket.io-client` package with a valid driver JWT.

## 🔒 Engineering Practices

- Separate controllers, services, and repositories.
- Validate request payloads before executing business logic.
- Store password hashes rather than plaintext passwords.
- Verify JWTs before granting access to protected operations.
- Use conditional database updates for race-sensitive ride assignment.
- Index geospatial fields for location-based queries.
- Keep secrets and environment configuration outside source control.

## 🧠 System Design Concepts Demonstrated

This project provides practical examples of:

- Layered architecture and separation of concerns
- REST API design and middleware
- Authentication and authorization
- Geospatial indexing and nearby-entity search
- Ride state machines
- Atomic operations and concurrency control
- Persistent socket connections and real-time events
- Database modelling and entity relationships
- Design considerations for scaling a modular monolith

The current implementation is a **modular monolith**, providing a foundation that could later be separated into services for identity, driver discovery, ride management, and real-time communication.

## 🗺️ Future Enhancements

- Interactive pickup and destination selection using Google Maps.
- Rider-facing live driver location updates.
- Driver and vehicle approval workflows for administrators.
- Route distance, estimated duration, and fare calculation.
- MongoDB transactions for consistency across related database writes.
- Automated tests and API documentation.
- Redis-based coordination and horizontal scaling where needed.

## 👨‍💻 Author

**Pranav Kumbhar**

Software Developer | Backend Engineering | AI & GenAI

Interested in building scalable backend systems, real-time applications, and production-oriented AI solutions.
