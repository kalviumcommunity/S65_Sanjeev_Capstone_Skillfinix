const express = require('express')
const router = express.Router()
const {signup, login, logout, onboard } = require('../controllers/authcontroller.js')
const {protectRoute} = require('../middleware/authmiddleware.js')

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.post("/onboarding", protectRoute, onboard)

// check if user is logged in or not
router.get("/me",protectRoute, (req,res)=>{
    res.status(200).json({success: true, user: req.user});
});

module.exports = router; 