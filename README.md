# 🛍️ E-Commerce

A **Full Stack E-Commerce Web Application** built using **React.js**, **Express.js**, **MongoDB**, and **Node.js**.  
This project provides a complete shopping experience — from product browsing to checkout — with authentication, cart management, and order processing.

---

## 🚀 Features

### 🧩 User Functionalities

- User authentication (Signup, Login, Logout)
- Add or remove products from the cart (authentication required)
- Update product quantities directly from the cart (authentication required)
- View cart summary with total amount (authentication required)
- Secure checkout page (authentication required)

### 🛠️ Admin Functionalities

> _Currently, there is no dedicated admin dashboard. All administrative operations can be tested using Postman._

- Add, update, or delete products
- Manage inventory and pricing

### 💾 Technical Highlights

- RESTful API built using **Express.js**
- Data storage with **MongoDB Atlas**
- **JWT-based authentication** for secure user sessions
- State management on the frontend using **React Context API**
- Responsive and modern UI powered by **Tailwind CSS**
- Proper error handling and response codes on both frontend and backend
- Modular folder structure for scalability and maintainability

---

## ⚙️ Setup Guidelines

### 1️⃣ Clone the repository

```bash
git clone https://github.com/NikhilKansotia/E-Commerce.git
cd E-Commerce
```

### 2️⃣ Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory with the following variables:

```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

> A sample `.env.example` file has been included for reference.

Run the backend server:

```bash
npm start
```

---

### 3️⃣ Frontend setup

```bash
cd ../client
npm install
npm run dev
```

In the frontend, API calls use the variable `BACKEND_BASE_URL = http://localhost:4000/api`.

You can either:

- Create a `.env` file in the `/client` directory and add this key-value pair, **or**
- Replace `BACKEND_BASE_URL` directly in the code wherever it's used.

This will start your frontend app on [http://localhost:5173](http://localhost:5173).

---

## 🧠 Folder Structure

```
E-Commerce/
│
├── client/         # React Frontend
├── server/         # Express + MongoDB Backend
├── .gitignore
├── README.md
└── package.json
```

---

## 🧑‍💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt.js

---
