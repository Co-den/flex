const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv =  require("dotenv")
dotenv.config({path:".env"});
const reviewsRouter = require("./routes/reviewRoutes");
const listingRoutes = require("./routes/listingRoutes");



const app = express();
app.use(cors());
app.use(express.json());


app.get("/_health", (req, res) => res.json({ ok: true }));

app.use("/api/reviews", reviewsRouter);
app.use("/api/listings", listingRoutes);

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
