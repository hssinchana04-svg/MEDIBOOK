# 🏥 Medibook — Healthcare Appointment Platform

A full-stack healthcare platform that connects patients with doctors. Book appointments, find nearby clinics, pay online, and get AI-powered health guidance.

**Live Demo:**
- 🌐 Frontend: https://medibook-frontend-jatq.onrender.com
- ⚙️ Backend API: https://medibook-backend-vhrm.onrender.com
- 🛡️ Admin Panel: https://medibook-admin-dmpw.onrender.com

---

## ✨ Features

### 👤 User Portal
- Register and login securely with JWT authentication
- Browse doctors by speciality
- View doctor profiles, fees, and availability
- Book appointments with date and time slot selection
- View and manage all booked appointments
- Update personal profile

### 🩺 Doctor Portal
- Doctor login and profile management
- View upcoming appointments
- Mark appointments as completed or cancelled
- Update availability, fees, and clinic details

### 🛡️ Admin Portal
- Approve and manage doctor registrations
- View all users and appointments
- Analytics dashboard
- Full platform control

### 📍 Nearby Doctors (Location Feature)
- GPS-based location detection
- Interactive Leaflet.js map with doctor pins
- Filter by speciality and search radius (1–50 km)
- One-click Google Maps directions to clinic

### 💳 Payments
- Razorpay payment gateway integration
- Secure booking fee collection
- Payment history tracking

### 🤖 AI Symptom Checker
- Powered by Google Gemini API
- Type symptoms and get specialist recommendations
- Direct booking link based on AI suggestion

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | API calls |
| Leaflet.js / React-Leaflet | Interactive maps |
| Razorpay SDK | Payment integration |
| Google Gemini API | AI symptom checker |
| React Toastify | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Cloudinary | Image storage |
| CORS | Cross-origin requests |

### DevOps
| Technology | Purpose |
|---|---|
| Render | Backend + Frontend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Media management |
| GitHub | Version control |

---

## 📁 Project Structure

```
MEDIBOOK/
├── frontend/          # React user-facing app
│   ├── src/
│   │   ├── components/    # Navbar, Footer etc.
│   │   ├── pages/         # Home, Doctors, Appointment, NearbyDoctors etc.
│   │   ├── context/       # AppContext (global state)
│   │   └── assets/        # Images and icons
│   └── .env
│
├── admin/             # React admin dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── .env
│
└── backend/           # Node.js REST API
    ├── controllers/   # Business logic
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    ├── middlewares/   # Auth middleware
    ├── config/        # DB connection
    ├── seed.js        # Database seeder
    └── server.js      # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/medibook.git
cd medibook
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
ADMIN_EMAIL=admin@medibook.com
ADMIN_PASSWORD=admin123
```

Seed the database:
```bash
node seed.js
```

Start the server:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY=your_razorpay_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Start the app:
```bash
npm run dev
```

### 4. Setup Admin Panel
```bash
cd admin
npm install
```

Create `admin/.env`:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Start admin:
```bash
npm run dev
```

---

## 🔌 API Reference

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/register` | Register new user |
| POST | `/api/user/login` | User login |
| GET | `/api/user/profile` | Get user profile |
| POST | `/api/user/update-profile` | Update user profile |

### Doctor Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctor/list` | Get all available doctors |
| GET | `/api/doctor/nearby` | Get nearby doctors by GPS |
| POST | `/api/doctor/login` | Doctor login |
| GET | `/api/doctor/profile` | Get doctor profile |
| POST | `/api/doctor/update-profile` | Update doctor profile |
| GET | `/api/doctor/appointments` | Get doctor's appointments |
| POST | `/api/doctor/complete-appointment` | Mark appointment complete |
| POST | `/api/doctor/cancel-appointment` | Cancel appointment |

### Appointment Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/book-appointment` | Book an appointment |
| GET | `/api/user/appointments` | Get user's appointments |
| POST | `/api/user/cancel-appointment` | Cancel appointment |

### Admin Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/doctors` | Get all doctors |
| POST | `/api/admin/add-doctor` | Add new doctor |
| GET | `/api/admin/appointments` | Get all appointments |
| GET | `/api/admin/dashboard` | Get dashboard stats |

### Nearby Doctors Query Params
```
GET /api/doctor/nearby?lat=12.9716&lng=77.5946&radius=10&speciality=Neurologist
```
| Param | Type | Description |
|---|---|---|
| lat | Number | User latitude |
| lng | Number | User longitude |
| radius | Number | Search radius in km (default: 10) |
| speciality | String | Filter by speciality (optional) |

---

## 🌍 Deployment

All services deployed on **Render**:

1. **Backend** — Web Service
   - Build: `npm install`
   - Start: `node server.js`

2. **Frontend** — Static Site
   - Build: `npm install && npm run build`
   - Publish: `dist`

3. **Admin** — Static Site
   - Build: `npm install && npm run build`
   - Publish: `dist`

---

## 👨‍💻 Author

Built with ❤️ as a portfolio project demonstrating full-stack development with AI and location-based features.

---

## 📄 License

MIT License — free to use for learning and portfolio purposes.