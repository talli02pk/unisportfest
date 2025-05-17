
# University Sports Fest Website

This is a web application for a university sports fest event, featuring a homepage with event details and a registration form that connects to a SQL Server database.

## Project Structure

- `/src` - Frontend React application
- `/server` - Backend Express.js API that connects to SQL Server

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- SQL Server installed and running
- SQL Server credentials

### Frontend Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env.local` file with:
```
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```
npm run dev
```

### Backend Setup

1. Navigate to the server directory:
```
cd server
```

2. Install server dependencies:
```
npm install
```

3. Create a `.env` file based on `.env.example` with your SQL Server credentials:
```
SQL_USER=your_username
SQL_PASSWORD=your_password
SQL_SERVER=your_server
SQL_DATABASE=SportsFestDB
PORT=5000
```

4. Start the server:
```
npm run dev
```

## Database Setup

The application will automatically create a `Registrations` table in your SQL Server database if it doesn't exist. Make sure your SQL user has permissions to create tables.

## Building for Production

1. Build the frontend:
```
npm run build
```

2. Set NODE_ENV to production in your server .env file:
```
NODE_ENV=production
```

3. Start the server which will serve the frontend build:
```
cd server
npm start
```

The application will be available at http://localhost:5000
