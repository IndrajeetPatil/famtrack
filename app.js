require("dotenv").config();
require("./db");

const express = require("express");
const hbs = require("hbs");
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// Configure session
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.locals.appTitle = "FamTrack";

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.js");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.js");
app.use("/", authRoutes);

const familyRoutes = require("./routes/family.js");
app.use("/", familyRoutes);

const familyMemberRoutes = require("./routes/member.js");
app.use("/", familyMemberRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
