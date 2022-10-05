const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const authPost = require("./routes/post.js")
//middlewares

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", authPost);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, () => {
      console.log("Connected to MongoDB");
      app.listen(3000, () => {
        console.log("Backend Server is running");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
