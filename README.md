# Oasis Infobyte Internship Projects
Intern: Lalatendu Nilakantha Sahoo
Track: Web Development & Designing
# 🍕 Oasis Pizza - Full Stack MERN Application

A premium, full-stack pizza delivery web application built with the MERN (MongoDB, Express, React, Node.js) stack. This project features a beautiful glassmorphism UI, seamless user authentication, and a dedicated real-time Admin Dashboard for order management.

## 🚀 Features

### For Customers:
*   **User Authentication:** Secure Login and Registration (JWT based).
*   **Interactive Menu:** Browse delicious pizzas with dynamic UI components.
*   **Cart & Checkout:** Add pizzas to the cart, review the order summary, and provide delivery details.
*   **Payment Integration:** Supports Cash on Delivery (COD) and Online Payments (Simulated/Razorpay).
*   **Order Tracking:** Dedicated "My Orders" page to track current status with color-coded badges.

### For Administrators (Admin Panel):
*   **Role-Based Access:** Secure route protection for Admin users.
*   **Live Dashboard:** View all incoming orders in a grid layout.
*   **Status Management:** Update order statuses in real-time (Order Received ➔ In the Kitchen ➔ Out for Delivery ➔ Delivered).

## 💻 Tech Stack
*   **Frontend:** React.js, React Router DOM, Framer Motion (for smooth animations), CSS3.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB & Mongoose.
*   **Authentication & Security:** JSON Web Tokens (JWT), bcrypt.js, CORS.
*   **Payment Gateway:** Razorpay API (Configured).

## 🛠️ Installation & Setup

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/lalatendu9938/OIBSIP.git
\`\`\`

**2. Setup Backend:**
\`\`\`bash
cd server
npm install
\`\`\`
*Create a `.env` file in the `server` directory and add the following:*
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
\`\`\`
*Start the server:*
\`\`\`bash
npm run dev
\`\`\`

**3. Setup Frontend:**
\`\`\`bash
cd client
npm install
npm start
\`\`\`

## 🌟 Application Preview
*The frontend runs on `http://localhost:3000` and the backend server on `[https://oasis-pizza.onrender.com](https://oasis-pizza.onrender.com)`.*

---
*Built with ❤️ by Lalatendu Nilakantha Sahoo*