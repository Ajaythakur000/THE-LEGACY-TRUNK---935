const express = require('express');
const router = express.Router();

// Controller se sabhi functions ko import karna
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController.js');

// Middleware se gatekeeper function ko import karna
const { protect } = require('../middleware/authMiddleware.js');

// Public Routes (Inhe koi bhi access kar sakta hai)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private Route (Ise sirf logged-in user hi access kar sakta hai)
// Yahan humne `protect` ko `getUserProfile` se pehle rakha hai.
// Iska matlab request pehle `protect` ke paas jaayegi, fir `getUserProfile` ke paas.
router.get('/profile', protect, getUserProfile);


module.exports = router;