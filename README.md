## Flex Living Dashboard

A modern, mobile-responsive dashboard for property managers to view, manage, and publish guest reviews from multiple platforms.

## ✨ Features

📊 Per-Property Performance KPIs (avg rating, total reviews, approved reviews, published reviews).

🔍 Filter & Sort reviews by rating, category, channel, or time.

📈 Spot Trends using interactive charts.

✅ Approve & Publish reviews to the public listing.

📱 Fully Responsive – works seamlessly on mobile, tablet, and desktop.

---

Review Integrations

Supports fetching reviews from multiple platforms:

Hostaway (direct API integration).

Airbnb (via API or scraping).

Google Reviews (Google Places API).

---

Public Listings

Clean public-facing review pages per property.

Display only manager-approved reviews.

Optimized for SEO and performance.



---

## 🚀 Tech Stack

Frontend: React + TailwindCSS

Backend: Node.js + Express

Database: MongoDB

Charts: Recharts

APIs Integrated: Hostaway, Airbnb, Google Places



---

## 📂 Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (KPIs, Filters, ReviewTable, etc.)
│   │   ├── pages/          # Dashboard + Public Review Pages
│   │   ├── api/            # API client logic
|   |   ├── hooks/           
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── controllers/        # logic for all controller
|   ├── data/               # mock-data
|   ├── integration/        # google Api
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
|   ├── utils/              # utilities
│   ├── seed/               
│   └── server.js
│
├── README.md
└── package.json

```
---

## ⚡️ Installation

1. Clone the repo

```
git clone https://github.com/Co-den/flex.git
cd flex

```
2. Setup backend
```
cd server
npm install

Create a .env file in server/ with:

MONGO_URI=your_mongodb_connection
HOSTAWAY_API_KEY=your_hostaway_key
AIRBNB_API_KEY=your_airbnb_key
GOOGLE_PLACES_API_KEY=your_google_places_key

Run server:

npm run dev

```
3. Setup frontend

```
cd client
npm install
npm run dev

```

---

## 🌍 API Routes

```
GET /api/reviews/hostaway → Fetch Hostaway reviews

GET /api/reviews/airbnb → Fetch Airbnb reviews

GET /api/reviews/google → Fetch Google Reviews

PATCH /api/reviews/:id/approve → Toggle approval status

GET /api/reviews/public/:listingName → Get public reviews for a listing

```

---

## 📱 Mobile Responsiveness

Search + filter stack vertically on mobile.

KPI cards adapt to grid columns (1 → 2 → 4).

Review table becomes scrollable on small screens.



---

## 🔮 Next Steps

Add authentication for managers (login/logout).

Schedule daily sync jobs for fetching new reviews.

Export reviews as CSV/PDF.

AI sentiment analysis for deeper insights.



---

## 👨‍💻 Author

Built with ❤️ by Agugbue Ikenna Nzubechi 

