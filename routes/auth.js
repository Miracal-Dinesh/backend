const express = require('express');
const router = express.Router();
const { register, login,activity,activities } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/activity',activity);
router.post('/showactivity',activities);

// Protected route example
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.send('Welcome Admin!');
});

module.exports = router;
