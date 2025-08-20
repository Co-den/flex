const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv =  require("dotenv")
dotenv.config({path:".env"});
const reviewsRouter = require("./routes/reviewRoutes");
const listingRoutes = require("./routes/listingRoutes");
const googleapiRoutes = require("./routes/googleapiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const gbRoutes = require("./routes/googleBusinessRoutes");



const app = express();

const allowedOrigins=[
  "https://flex-1-o88e.onrender.com",
  "http://localhost:5173",
  "https://flex-living-virid.vercel.app",
  "https://flex-1-o88e.onrender.com/api/reviews/hostaway"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());


app.get("/_health", (req, res) => res.json({ ok: true }));

app.use("/api/reviews", reviewsRouter);
app.use("/api/listings", listingRoutes);
app.use("/api/external", googleapiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/external", gbRoutes);


// request logger (light)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${req.ip} origin=${req.get('origin') || '-'}`);
  next();
});

// serve static if needed later
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
  .then(()=> {
    console.log("Connected to MongoDB");
    app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err=> {
    console.error("Mongo connection error", err);
    process.exit(1);
  });
