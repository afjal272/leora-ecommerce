# 🚀 Leora — Production-Grade E-Commerce Platform

A full-stack eCommerce system built with a focus on real-world architecture, scalability, and clean engineering practices.  
This is not just a UI project — it implements a complete business flow from authentication to order management.

---

## 🧠 What This Project Solves

Most beginner projects stop at UI or static data.  
Leora goes beyond that by implementing:

- End-to-end authentication flow (OTP + JWT)
- Admin-controlled product system
- Persistent cart & checkout logic
- Order lifecycle management
- Backend-driven architecture

---

## ⚙️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hook Form

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)

### Architecture
- REST API communication
- Role-based access control
- Modular backend structure

---

## 🔐 Core Features

### Authentication
- OTP-based login system
- JWT authentication
- Secure role handling (User / Admin)

### Product System
- Admin-only product creation & updates
- Dynamic product rendering
- Structured data handling

### Cart & Checkout
- Add to cart with quantity control
- Address selection system
- Seamless checkout flow

### Orders
- Order creation & persistence
- Order history tracking
- Status-based lifecycle

---

## 📁 Project Structure

```
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
```

---

## 🌐 Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=https://your-backend-url
```

### Backend (.env)
```
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret
```

---

## 🚀 Running Locally

```
npm install
npm run dev
```

---

## 🔄 System Flow (High-Level)

1. User logs in via OTP  
2. JWT issued and stored  
3. Products fetched from backend  
4. User adds items to cart  
5. Checkout triggers order creation  
6. Order stored and visible in dashboard  

---

## 📈 Future Scope

- Razorpay Payment Integration  
- Invoice Generation System  
- WhatsApp Notifications  
- Advanced Search & Filtering  
- Performance Optimization  

---

## 💡 Key Engineering Highlights

- End-to-end TypeScript (frontend + backend)
- Clean separation of concerns
- Scalable folder architecture
- Real-world API design
- Production deployment ready

---

## 👨‍💻 Author

**Md Afjal Ali**
