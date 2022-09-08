const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, signin, signout, isSignedIn } = require('../controllers/auth')

router.post("/signup", [
    check('name', 'name should be at least 3 character').isLength({ min: 5 }),
    check('email', 'Email is required').isEmail(),
    check('password', 'name should be at least 5 character').isLength({ min: 5 }),
], signup)


router.post("/signin", [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password field is required').isLength({ min: 5 }),
], signin)


router.get("/signout", signout)

router.get("/testroute", isSignedIn, (req, res) => {
    res.send("protected route");
});

module.exports = router;
