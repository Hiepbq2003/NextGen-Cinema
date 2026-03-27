# 🎬 NextGen Cinema - Ticket Booking System

A comprehensive Full-stack application designed for cinema management and online ticket booking. This system provides a seamless experience for customers to browse movies, select seats, and make payments, while offering powerful management tools for Staff and Administrators.

**Live Demo:** [https://next-gen-cinema-lnnf.vercel.app/](https://next-gen-cinema-lnnf.vercel.app/)  
**Backend Source:** [https://github.com/XuanLocLuong/be-sba](https://github.com/XuanLocLuong/be-sba)

---

## 🌟 Features

### 👤 Customer (User)
* **Authentication:** Register, Login (Local & OAuth2 via Google), Forgot/Change Password.
* **Movie Discovery:** Browse ongoing and upcoming movies, view detailed movie information.
* **Booking & Seat Selection:** Select showtimes and pick seats via a real-time interactive Seat Map.
* **Payment & Promotions:** Integrated QR code payment, apply discount codes (Vouchers).
* **Profile Management:** View booking history (My Tickets) and manage personal profile.

### 👨‍💼 Staff
* **POS System:** Support direct ticket booking at the counter for walk-in customers.
* **Booking Management:** View booking lists, check-in, and verify tickets for customers.
* **Dashboard:** Basic statistics for the current work shift.

### 👑 Administrator (Admin)
* **Dashboard:** Comprehensive statistics on revenue, tickets sold, and new registrations.
* **Catalog Management:** Movies, Rooms, Seats, and Showtimes scheduling.
* **Operational Management:** Booking, Voucher/Discount, and Account management (Staff/Users).

---

## 📂 Project Structure

The project is divided into two main repositories/folders:

```text
NextGen-Cinema/
 ├── NextGen-Cinema/    # React Frontend (Vite)
 └── be-sba/            # Spring Boot Backend
```

### 🎨 Frontend (`/NextGen-Cinema`)
* **Framework:** ReactJS 19 (Vite)
* **Routing:** React Router DOM 7
* **Styling:** Vanilla CSS / CSS Modules / Bootstrap 5
* **State Management:** Context API (`AuthContext`)
* **API Client:** Axios (with Interceptors)

### ⚙️ Backend (`/be-sba`)
* **Framework:** Java Spring Boot 4.x
* **Security:** Spring Security, JWT, OAuth2
* **Database:** MySQL & Hibernate (JPA)
* **Storage:** Google Drive API Integration (for images)
* **Communication:** JavaMailSender (Email notifications)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- MySQL Database

### Backend Setup (`be-sba`)
1. Create a `key.env` file or set the following environment variables:
   ```env
   DB_HOST=your_host
   DB_PORT=your_port
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   MAIL_USERNAME=your_email
   MAIL_PASSWORD=your_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id
   GOOGLE_DRIVE_CLIENT_ID=your_drive_client_id
   GOOGLE_DRIVE_CLIENT_SECRET=your_drive_client_secret
   GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
   ```
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup (`NextGen-Cinema`)
1. Navigate to the directory: `cd NextGen-Cinema`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---

## 🧪 Test Accounts

For testing purposes, the system is initialized with the following default accounts:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` |
| **Staff** | `staff1` | `staff123` |
| **Staff** | `staff2` | `staff123` |

---

## 🛠 Project Architecture

### Backend Directory Structure
```text
src/main/java/.../besba/
 ├── config/        # System configuration (Security, CORS)
 ├── controller/    # REST API Controllers
 ├── dto/           # Data Transfer Objects
 ├── entity/        # Database Entities
 ├── exception/     # Global Error Handling
 ├── repository/    # JPA Repositories
 ├── security/      # JWT & OAuth2 Filters
 ├── service/       # Business Logic
 └── utils/         # Helper Classes (Email, JWT)
```

### Frontend Directory Structure
```text
src/
 ├── asset/         # Styles, Images, Fonts
 ├── components/    # Reusable UI (SeatMap, Layout, Header)
 ├── context/       # AuthContext
 ├── hooks/         # Custom Hooks
 ├── pages/         # Views (Admin, Staff, Customer)
 ├── services/api/  # Axios configuration & API calls
 └── utils/         # Constants & Helpers
```
