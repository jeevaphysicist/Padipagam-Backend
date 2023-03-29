const express = require("express");
const {signup , login} = require('../Controllers/UserCollection');
const router = express.Router();

// Sign up
router.post("/signup",signup); 

// login
router.post("/login",login);

// confirm 
router.get('/confrim/:id',);

// social media auth
router.post("/socialauth",); 

module.exports = router ;