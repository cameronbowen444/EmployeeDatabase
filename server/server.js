const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require("./config/mongoose.config");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://employeedatabase-d9cz.onrender.com",

  // Add your Vercel frontend URL here later:
  // "https://your-vercel-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Employee Database API is running");
});

require("./routes/member.routes")(app);
require("./routes/user.routes")(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}!`);
});