// routes/index.js
const express = require('express');
const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
    res.render('welcome'); // Ensure welcome.ejs exists in the views directory
});



module.exports = router;
