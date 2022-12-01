const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const path = require("path")
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:true},
  () => {
    console.log("Database connected");
  }
);

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "https://www.prosper-media.cf")
  next();
});
let whiteList = ["https://www.prosper-media.cf","http://localhost:3000","https://www.prosper-admin.cf","http://192.168.0.227:3000"]
app.use(express.json());
app.use(
  cors({
    origin: whiteList
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("server is running");
});
