const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// simple auth middleware, this function checks if the user is logged in and redirects to login if not
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

//The routes here connect HTTP requests to the student controller functions

router.get('/', ensureAuth, studentController.list);
router.get('/add', ensureAuth, studentController.showCreate);
router.post('/add', ensureAuth, studentController.create);
router.get('/edit/:id', ensureAuth, studentController.showEdit);
router.post('/edit/:id', ensureAuth, studentController.update);
router.post('/delete/:id', ensureAuth, studentController.remove);

module.exports = router;
