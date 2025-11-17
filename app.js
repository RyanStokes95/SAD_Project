const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
const PORT = 3000;

//View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

//Make session available to all EJS views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

//Routes
app.get('/', (req, res) => res.redirect('/login'));
app.use('/', userRoutes);
app.use('/students', studentRoutes);

//Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
