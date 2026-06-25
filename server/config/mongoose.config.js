const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MONGO_URI is missing. Check your server/.env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("Established a connection to the database!"))
  .catch((err) => {
    console.log("Something went wrong when connecting to the database!", err);
  });