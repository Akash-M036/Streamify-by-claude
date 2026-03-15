# 🎬 Streamify — Personalized OTT Platform

A full-stack MERN OTT platform with Instagram-style video feed, YouTube integration, personalized recommendations, and user profiles.

---

## 🗂️ Project Structure

```
ott-platform/
├── backend/                   # Node.js + Express API
│   ├── models/User.js         # MongoDB user schema
│   ├── routes/
│   │   ├── auth.js            # Register / Login (JWT)
│   │   ├── videos.js          # YouTube API integration
│   │   ├── user.js            # Watch history, likes, saved
│   │   └── recommendations.js # Personalized feed
│   ├── middleware/auth.js     # JWT protect middleware
│   ├── server.js              # Express entry point
│   └── .env                   # ⚠️ Your secrets go here
│
├── frontend/                  # React app
│   ├── src/
│   │   ├── context/AuthContext.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── VideoCard.js
│   │   │   ├── SkeletonGrid.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js         # Instagram-style feed
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Recommendations.js
│   │   │   ├── Search.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── public/index.html
│
├── start.sh                   # Linux/Mac launcher
├── start.bat                  # Windows launcher
└── setup-mongodb.sh           # MongoDB installer
```

---

## ⚙️ Step-by-Step Setup

### STEP 1 — Install MongoDB

#### Windows:
1. Go to: https://www.mongodb.com/try/download/community
2. Download **MongoDB Community Server** (Windows .msi)
3. Run installer → choose **Complete** setup
4. ✅ Check **"Install MongoDB as a Service"**
5. MongoDB starts automatically after install

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
bash setup-mongodb.sh
```

---

### STEP 2 — Get YouTube Data API v3 Key (FREE)

1. Go to: https://console.cloud.google.com/
2. Create a new project (e.g., "Streamify")
3. Enable **YouTube Data API v3**:
   - APIs & Services → Library → Search "YouTube Data API v3" → Enable
4. Create credentials:
   - APIs & Services → Credentials → Create Credentials → API Key
5. Copy your API key

---

### STEP 3 — Configure Environment Variables

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ottplatform
JWT_SECRET=make_this_a_long_random_string_like_abc123xyz789
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
CLIENT_URL=http://localhost:3000
```

---

### STEP 4 — Run the App

#### Windows:
Double-click **`start.bat`**
OR open CMD in project folder:
```cmd
start.bat
```

#### macOS / Linux:
```bash
chmod +x start.sh
./start.sh
```

#### Manual (any OS):
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

---

### STEP 5 — Open in Browser

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

Register an account, select your preferred categories, and start watching!

---

## 🎯 Features

| Feature | Description |
|--------|-------------|
| 🔐 Auth | JWT-based Register / Login with category preferences |
| 🏠 Home Feed | Instagram-style grid with Movies, Gaming, Education, Music tabs |
| ▶️ Watch | Click any video → opens YouTube in new tab |
| ❤️ Like | Like videos — stored in MongoDB |
| 🔖 Save | Save to watchlist — persists to your profile |
| 🕐 History | Tracks every video you watch + play count |
| ⭐ Recommendations | AI-style feed based on your most-watched categories |
| 🔍 Search | Search YouTube via the navbar |
| 👤 Profile | See liked, saved, history with stats |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/videos/feed` | Personalized feed |
| GET | `/api/videos/search?q=` | Search YouTube |
| GET | `/api/videos/category/:cat` | Videos by category |
| POST | `/api/user/watch` | Track watch |
| POST | `/api/user/like` | Toggle like |
| POST | `/api/user/save` | Toggle save |
| GET | `/api/user/history` | Watch history |
| GET | `/api/recommendations` | Smart recommendations |

---

## 🚀 Tech Stack

- **MongoDB** — User data, preferences, history
- **Express.js** — REST API
- **React 18** — UI with hooks & context
- **Node.js** — Runtime
- **YouTube Data API v3** — Video content
- **JWT** — Authentication
- **Axios** — HTTP client
- **React Router v6** — Navigation
- **React Toastify** — Notifications

---

## ⚠️ YouTube API Quota

The free YouTube Data API gives **10,000 units/day**.
- Each search = ~100 units
- Roughly 100 requests/day on free tier
- For more: enable billing on Google Cloud (still mostly free)

---

## 🛠️ Common Issues

**"Cannot connect to MongoDB"**
→ Make sure MongoDB service is running.
→ Windows: Open Services → find "MongoDB" → Start

**"YouTube API key invalid"**
→ Double-check the key in `backend/.env`
→ Make sure YouTube Data API v3 is enabled in Google Console

**"Port 3000 already in use"**
→ Change port: `set PORT=3001 && npm start` (Windows) or `PORT=3001 npm start` (Mac/Linux)

**CORS errors in browser**
→ Make sure `CLIENT_URL` in `.env` matches your frontend URL exactly

---

## 📈 Future Enhancements

- [ ] Embed YouTube player directly (no redirect)
- [ ] Social features (follow users, shared watchlists)
- [ ] PWA support (install as mobile app)
- [ ] Push notifications for new content
- [ ] Admin dashboard

---

Built with ❤️ using MERN Stack
