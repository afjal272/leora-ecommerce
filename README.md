# 🛒 Leora — Production-Grade E-Commerce Platform

A full-stack eCommerce application built to simulate real-world business logic, not just UI screens.  
This project covers the complete flow from authentication to order management with a scalable architecture.

---

## 🧠 Problem It Solves

Most beginner projects stop at UI or static data.

Leora focuses on:
- Real backend integration  
- Persistent data handling  
- Role-based system control  
- End-to-end user flow  

---

## 🚀 Core Features

### 🔐 Authentication
- OTP-based login system  
- JWT authentication  
- Role-based access (User / Admin)  

### 📦 Product System
- Admin-controlled product creation & updates  
- Dynamic product rendering from backend  
- Structured data with Prisma ORM  

### 🛒 Cart & Checkout
- Add to cart with quantity management  
- Address selection system  
- Smooth checkout flow  

### 📊 Orders
- Order creation & database persistence  
- Order history tracking  
- Status-based lifecycle (Pending → Delivered)  

---

## ⚙️ Tech Stack

### Frontend
- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- Zustand  
- React Hook Form  

### Backend
- Node.js  
- Express.js  
- TypeScript  
- Prisma ORM  
- PostgreSQL (Neon)  

---

## 🧠 Architecture Highlights

- REST API-based communication  
- Modular backend structure  
- Role-based authorization  
- Clean separation of concerns  
- End-to-end TypeScript  

---

## 📁 Project Structure

/frontend  
  /app  
  /components  
  /store  
  /lib  

/backend  
  /controllers  
  /routes  
  /middlewares  
  /prisma  
  /utils  

---

## 🌐 Environment Variables

### Frontend (.env)
NEXT_PUBLIC_API_URL=https://your-backend-url  

### Backend (.env)
PORT=5000  
DATABASE_URL=your_postgresql_url  
JWT_SECRET=your_secret  

---

## 🚀 Running Locally

npm install  
npm run dev  

---

## 🔄 System Flow

1. User logs in via OTP  
2. JWT is issued and stored  
3. Products are fetched from backend  
4. User adds items to cart  
5. Checkout creates an order  
6. Order stored and visible in dashboard  

---

## 📈 Future Improvements

- Razorpay payment integration  
- Invoice generation system  
- WhatsApp notifications  
- Advanced search & filtering  
- Performance optimization  

---

## 💡 Key Highlights

- Real-world eCommerce flow implementation  
- Full-stack architecture (Frontend + Backend + DB)  
- Production-ready structure  
- Focus on scalability and maintainability  

---

## 👨‍💻 Author

Md Afjal Ali
