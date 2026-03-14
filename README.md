# Clean Tourist – Smart Waste Management for Tourist Places

A full-stack MERN application designed to help tourists keep tourist destinations clean. This platform allows users to find nearby dustbins, report garbage issues, join cleanup events, and earn rewards for their environmental impact.

## 🚀 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT with Bcrypt password hashing
- **Image Upload:** Cloudinary (Logic implemented, needs configuration)
- **Maps:** Google Maps API & Browser Geolocation

## ✨ Features

- **User Authentication:** Secure signup/login with JWT and protected routes.
- **Nearby Dustbin Finder:** Real-time map showing nearby public and recycling bins using geolocation.
- **Garbage Reporting:** Report waste with photos, descriptions, and automatic location detection.
- **Cleanliness Score:** Dynamic scoring for tourist places based on reports and ratings.
- **Reward System:** Earn "Eco-Points" and unlock badges like "Eco Warrior" for positive actions.
- **Cleanup Events:** Join and participate in volunteer-driven cleanup drives.
- **Admin Dashboard:** Centralized console for managing reports, events, and tourist places.
- **Modern UI/UX:** Professional, interactive interface with dark/light mode, smooth animations, and responsive design.

## 📂 Project Structure

```text
├── backend/
│   ├── config/         # Database and third-party configs
│   ├── controllers/    # API logic
│   ├── middleware/     # Auth and error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   └── utils/          # Helper functions (Cloudinary)
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth and Theme providers
    │   ├── pages/      # Main application pages
    │   ├── layouts/    # Page structures
    │   └── assets/     # Images and styles
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js & npm installed
- MongoDB account (Atlas or Local)
- Google Maps API Key
- Cloudinary account

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your credentials:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your Google Maps API key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌟 Contributing

We welcome contributions to make our planet cleaner! Feel free to fork the repo and submit pull requests.

## 📄 License

This project is licensed under the ISC License.
