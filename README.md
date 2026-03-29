# 🎨 NextGen Cinema - Frontend

The React-based frontend application for the Cinema Ticket Booking System. Built with Vite and modern React patterns.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## 🛠 Tech Stack
- **Framework:** ReactJS 19 (Vite)
- **Routing:** React Router DOM 7 (with Protected Routes)
- **Networking:** Axios (with Bearer Token interceptors)
- **Styling:** Vanilla CSS / CSS Modules / Bootstrap 5
- **Icons:** React Icons & Lucide React
- **Charts:** Recharts (Admin statistics)

## 📂 Folder Structure
```text
src/
 ├── asset/         # CSS files, Images, Fonts...
 ├── components/    # Reusable UI components (Layout, Header, Footer, SeatMap, Card...)
 ├── context/       # AuthContext for global user state
 ├── hooks/         # Custom hooks (UseBookingTimer, etc.)
 ├── pages/         # Views categorized by roles: admin, auth, common, info, staff
 ├── router/        # App routing configuration
 ├── services/api/  # API call implementations via Axios
 └── utils/         # Utility functions and constants
```

## 🔐 Key Features
- **Real-time Seat Map:** Interactive seat selection with status updates.
- **Role-based Access:** Protected routes for Staff and Admin.
- **Responsive Design:** Optimized for both Desktop and Mobile users.
- **Authentication:** Integrated Login/Register and Google OAuth2 support.
