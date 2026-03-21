# 🎬 Cinema Ticket Booking System

A comprehensive Full-stack application designed for cinema management and online ticket booking. This system provides a seamless experience for customers to browse movies, select seats, and make payments, while offering powerful management tools for Staff and Administrators.

Link Deploy:https://next-gen-cinema-lnnf.vercel.app/

Link BE:https://github.com/XuanLocLuong/be-sba/tree/main

---

## 🌟 Features

The system is designed with 3 main roles:

### 👤 Customer (User)
* **Authentication:** Register, Login (Local & OAuth2 via Google), Forgot/Change Password.
* **Movie Discovery:** Browse ongoing and upcoming movies, view detailed movie information.
* **Booking & Seat Selection:** Select showtimes and pick seats via a real-time interactive Seat Map to prevent double-booking.
* **Payment & Promotions:** Integrated QR code payment, apply discount codes (Vouchers).
* **Profile Management:** View booking history (My Tickets) and manage personal profile.

### 👨‍💼 Staff
* **POS System:** Support direct ticket booking at the counter for walk-in customers.
* **Booking Management:** View booking lists, check-in, and verify tickets for customers.
* **Dashboard:** Basic statistics for the current work shift.

### 👑 Administrator (Admin)
* **Dashboard:** Comprehensive statistics on revenue, tickets sold, and new user registrations.
* **Catalog Management:** * Movies, Rooms, and Seats.
  * Showtimes scheduling.
* **Operational Management:**
  * System-wide Booking management.
  * Voucher/Discount management.
  * Account management (Staff and Users).

---

## 💻 Tech Stack

### 🎨 Frontend
* **Framework/Library:** ReactJS (Vite/CRA)
* **Routing:** React Router DOM (with Protected Routes)
* **Network:** Axios (Interceptors for JWT token handling)
* **Styling:** Vanilla CSS / CSS Modules (well-organized in `src/asset/style`)
* **Architecture:** Component-based, Hooks, Context API (`AuthContext`).

### ⚙️ Backend
* **Framework:** Java Spring Boot 3.x
* **Security:** Spring Security, JWT (JSON Web Tokens), OAuth2
* **Database:** MySQL & Spring Data JPA (Hibernate)
* **Others:** * Email Sending (JavaMailSender)
  * Google Drive API Integration (For movie images/posters storage)
  * Lombok, MapStruct (Data Mapping)

---

## 📂 Project Structure

The project is divided into two main parts: Backend (Spring Boot) and Frontend (React).

### Frontend (`/src`)
```text
src/
 ├── asset/         # CSS files, Images, Fonts...
 ├── components/    # Reusable UI components (Layout, Header, Footer, SeatMap, Card...)
 ├── context/       # React Context (AuthContext...)
 ├── hooks/         # Custom hooks (UseBookingTimer...)
 ├── pages/         # Views categorized by roles: admin, auth, common, info, staff
 ├── router/        # App routing (AppRouter, ProtectedRoute)
 ├── services/api/  # Axios configuration and API calls (AuthApi, MovieApi, BookingApi...)
 └── utils/         # Utilities and constants
