const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
require("dotenv").config();
const expressSession = require("express-session");
const flash = require("connect-flash");

// Import Routers
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter"); // Products Router
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  expressSession({
    secret: "bohra", // Replace this with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use("/owners", ownersRouter);
app.use("/products", productsRouter); // Products Route included
app.use("/users", usersRouter);
app.use("/", indexRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
