const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require("./config/mongoose.config");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require("./routes/member.routes")(app);
require("./routes/user.routes")(app);

app.listen(8000, () => console.log("Connected to port 8000!"));