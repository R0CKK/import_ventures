# Import Ventures Marketplace

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Routes](#frontend-routes)
- [Database Models](#database-models)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview
Import Ventures is a comprehensive port solutions marketplace platform that connects businesses with India's premier ports. The platform offers real-time information, seamless booking, and expert support for all major Indian ports, streamlining import operations for businesses of all sizes.

The application features a dual-interface marketplace that caters to both buyers and sellers of port services, providing a complete ecosystem for maritime logistics operations.

## Features
- **Dual Marketplace Interface**: Separate experiences for buyers and sellers
- **User Authentication**: JWT-based authentication with role-based access control
- **Product/Service Management**: For sellers to list and manage their port services
- **Shopping Cart**: For buyers to add and manage port service bookings
- **Order Management**: Complete order processing system
- **User Profiles**: Comprehensive profile management system
- **Responsive Design**: Mobile-first responsive UI

## Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- CORS for cross-origin resource sharing
- Morgan for HTTP request logging
- Helmet for security

### Frontend
- React.js
- React Router for navigation
- Lucide React for icons
- Axios for API calls
- CSS for styling

### Testing
- Jest for backend testing
- React Testing Library for frontend testing

## Project Structure
```
Import-Ventures/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   ├── server.js
│   └── testAPI.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── tests/
│   │   └── utils/
│   ├── package.json
│   └── src/
│       ├── App.js
│       ├── index.css
│       └── index.js
├── css/
├── js/
└── index.html
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance like MongoDB Atlas)

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/R0CKK/import_ventures.git
cd import_ventures/backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory (see [Environment Variables](#environment-variables) section)

4. Start the backend server:
```bash
npm run dev  # For development with auto-restart
# or
npm start   # For production
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/import-ventures-marketplace
JWT_SECRET=your_jwt_secret_key_here
```

For production environments, replace the MongoDB URI with your actual database connection string.

## Running the Application

### Development
1. Make sure MongoDB is running on your system
2. Start the backend server:
```bash
cd backend
npm run dev
```
3. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

### Seeding the Database
To populate the database with sample data:
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (seller only)
- `PUT /api/products/:id` - Update a product (seller only)
- `DELETE /api/products/:id` - Delete a product (seller only)

### Orders
- `GET /api/orders` - Get all orders (buyer/seller based on role)
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/api/orders/:id` - Update an order (seller only)

## Frontend Routes

### Public Routes
- `/` - Home page
- `/products` - Product listing page
- `/product/:id` - Product detail page
- `/cart` - Shopping cart
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Buyer)
- `/profile` - User profile
- `/myorders` - My orders page
- `/checkout` - Checkout process
- `/order/:id` - Order details

### Protected Routes (Seller)
- `/seller/dashboard` - Seller dashboard
- `/seller/products` - Seller's products
- `/seller/orders` - Seller's orders
- `/seller/products/add` - Add new product
- `/seller/products/edit/:id` - Edit product

## Database Models

### User Model
- `_id`: ObjectId
- `name`: String (required, max 50 chars)
- `email`: String (required, unique)
- `password`: String (required, min 6 chars)
- `role`: String (enum: 'buyer', 'seller', 'admin')
- `isActive`: Boolean (default: true)
- `profile`: Object (avatar, phone, company info, address, tax info)
- `verification`: Object (email verification status)
- `timestamps`: createdAt, updatedAt

### Product Model
- `_id`: ObjectId
- `name`: String (required)
- `description`: String (required)
- `category`: String (e.g., 'container-handling', 'customs-clearance')
- `price`: Number (required)
- `seller`: ObjectId (ref: 'User')
- `images`: [String] (array of image URLs)
- `stock`: Number (default: 0)
- `isActive`: Boolean (default: true)
- `rating`: Number (default: 0)
- `numReviews`: Number (default: 0)
- `timestamps`: createdAt, updatedAt

### Order Model
- `_id`: ObjectId
- `user`: ObjectId (ref: 'User', buyer)
- `seller`: ObjectId (ref: 'User', seller)
- `orderItems`: Array of objects (product, name, qty, price)
- `shippingAddress`: Object (address, city, postalCode, country)
- `paymentMethod`: String
- `paymentResult`: Object (id, status, update_time, email_address)
- `itemsPrice`: Number
- `taxPrice`: Number
- `shippingPrice`: Number
- `totalPrice`: Number
- `isPaid`: Boolean (default: false)
- `paidAt`: Date
- `isDelivered`: Boolean (default: false)
- `deliveredAt`: Date
- `timestamps`: createdAt, updatedAt

## Testing

### Backend Tests
To run backend tests:
```bash
cd backend
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm run test:coverage
```

### Frontend Tests
To run frontend tests:
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set the `NODE_ENV` environment variable to `production`
2. Update the `MONGODB_URI` to your production database
3. Run the production server:
```bash
npm start
```

### Frontend Deployment
For deployment to a static hosting service (like Netlify, Vercel, or GitHub Pages):
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style Guidelines
- Use consistent indentation (2 spaces)
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Follow the existing code formatting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or encounter issues with the application, please open an issue in the GitHub repository.

---


node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
build/
dist/
```
