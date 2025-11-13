// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// simple auth middleware
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

router.get('/', ensureAuth, studentController.list);
router.get('/add', ensureAuth, studentController.showCreate);
router.post('/add', ensureAuth, studentController.create);
router.get('/edit/:id', ensureAuth, studentController.showEdit);
router.post('/edit/:id', ensureAuth, studentController.update);
router.post('/delete/:id', ensureAuth, studentController.remove);

module.exports = router;
