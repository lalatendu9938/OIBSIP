# Oasis Pizza 🍕

**Oasis Infobyte Internship Project (Level 3)**
- **Intern:** Lalatendu Nilakantha Sahoo
- **Track:** Web Development & Designing

---

## Overview
A full-stack pizza delivery web application built using the MERN stack. This project implements a complete e-commerce flow, from user authentication and custom pizza building to payment processing and an admin dashboard for order management.

## Live Links
- **Frontend App:** [oasis-pizza-nine.vercel.app](https://oasis-pizza-nine.vercel.app)
- **Backend API:** [oasis-pizza.onrender.com](https://oasis-pizza.onrender.com)

## Core Features

**Client-Side (User Profile):**
- **JWT Authentication:** Secure login and registration flow.
- **Custom Pizza Builder:** Dynamic step-by-step customization (base, sauce, cheese, toppings).
- **Cart & Checkout:** State management for cart operations and order validation.
- **Payment Gateway:** Razorpay API integration (Test mode) and Cash on Delivery (COD) options.
- **Order Tracking:** User dashboard to track order status.

**Admin Panel:**
- **Role-Based Access Control (RBAC):** Protected routes exclusively for administrators.
- **Order Management:** Live grid view of all active orders.
- **Status Updates:** Update order lifecycle (Received -> In Kitchen -> Out for Delivery -> Delivered).

## Tech Stack
- **Frontend:** React.js, React Router, Framer Motion, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** bcrypt.js for password hashing, JWT for session management
- **Payments:** Razorpay API

## Local Setup

### 1. Clone the repository
```bash
git clone [https://github.com/lalatendu9938/OIBSIP.git](https://github.com/lalatendu9938/OIBSIP.git)
2. Backend Setup
Bash
cd server
npm install
Create a .env file in the /server directory and configure the environment variables:

Code snippet
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
RAZORPAY_KEY_ID=<your_razorpay_key>
RAZORPAY_SECRET=<your_razorpay_secret>
Start the backend server:

Bash
npm run dev
3. Frontend Setup
Bash
cd client
npm install
npm start
The client will start running at http://localhost:3000.

Developed by Lalatendu Nilakantha Sahoo