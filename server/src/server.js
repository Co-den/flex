const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv =  require("dotenv")
dotenv.config({path:".env"});
const reviewsRouter = require("./routes/reviewRoutes");
const listingRoutes = require("./routes/listingRoutes");


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

// DEBUG helpers: list registered routes and log incoming requests
function listRoutes(app) {
  const routes = [];
  (app._router?.stack || []).forEach(mw => {
    if (mw.route) {
      // direct route
      routes.push({ path: mw.route.path, methods: Object.keys(mw.route.methods).join(",") });
    } else if (mw.name === 'router' && mw.handle && mw.handle.stack) {
      // router mounted: try to find mount path via regexp
      const mountPath = mw.regexp && mw.regexp.source ? mw.regexp.source.replace('\\/?', '').replace('(?=\\/|$)', '') : '';
      mw.handle.stack.forEach(r => {
        if (r.route) routes.push({ path: (mountPath || '') + r.route.path, methods: Object.keys(r.route.methods).join(",") });
      });
    }
  });
  console.log("=== Registered routes (truncated) ===");
  routes.forEach(r => console.log(r.methods.padEnd(10), r.path));
  console.log("=====================================");
}

// request logger (light)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${req.ip} origin=${req.get('origin') || '-'}`);
  next();
});

// call listing right away so we can see what's mounted at startup
listRoutes(app);


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
