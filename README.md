# FlexLiving Reviews (MERN)

A **full-stack MERN application** for managing and displaying property reviews.
It includes a **dashboard** for admins to sync/manage reviews and a **public-facing page** for viewing listings with their reviews.

---

## 🚀 Features

### Admin Dashboard

* Fetches and displays reviews from external sources.
* Sync button to update reviews (prevents overwriting `approved` status).
* Approve/reject reviews.
* Refresh functionality.
* Loading spinner & skeleton loading for smoother UX.

### Public Page

* Displays property details and reviews.
* Dropdown selector to switch between listings.
* Dynamically fetches reviews per property.
* Displays **splash image** for listings.

---

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Other:** Axios (API calls), Concurrently (dev scripts)

---

## 📂 Project Structure

```
.
├── backend/
│   ├── models/
│   │   └── Review.js
│   ├── routes/
│   │   └── reviewRoutes.js
│   ├── mock-data.json
│   ├── server.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── PublicPage.jsx
│   │   ├── components/
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── Spinner.jsx
│   │   └── App.js
│   ├── package.json
│   └── ...
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/flexliving-reviews.git
cd flexliving-reviews
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 3. Environment Variables

In `/backend/.env`, add:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flexliving
PORT=5000
```

### 4. Run the app

Root directory:

```bash
npm run dev
```

This will:

* Start backend on **[http://localhost:5000](http://localhost:5000)**
* Start frontend on **[http://localhost:3000](http://localhost:3000)**

---

## 📊 API Endpoints

### Reviews

* `GET /api/reviews` → Fetch all reviews
* `POST /api/reviews/sync` → Sync mock-data into DB
* `PATCH /api/reviews/:id/approve` → Approve/reject a review
* `GET /api/reviews/:listingName` → Fetch reviews by property

---

## 🧪 Assessment Criteria Coverage

✅ **Backend**

* REST endpoints implemented (CRUD + Sync).
* Validation & separation of controllers/routes.

✅ **Frontend**

* Dashboard for admins.
* Public page for listings.
* Debounced fetch & state management.
* Loading states (spinner + skeleton).

✅ **Extra polish**

* Dropdown to switch listings.
* Splash images for properties.

---


## 📝 Future Improvements

* User authentication for admin dashboard.
* Pagination & filtering of reviews.
* Image upload for properties.
* Deploy frontend + backend (e.g., Netlify + Render).

---

## 👨‍💻 Author

**Agugbue Ikenna Nzubechi**
Software Developer | MERN Stack

---

