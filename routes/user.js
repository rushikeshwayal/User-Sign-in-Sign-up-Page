const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/userSchem');

// Login route
router.get('/login', (req, res) => {
    res.render('login', { errors: [] });
});

// Register route (GET)
router.get('/register', (req, res) => {
    res.render('register', { errors: [] });
});



// Register route (POST)
router.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    let errors = [];

    if (!name || !email || !password || !confirm_password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters long' });
    }

    if (errors.length > 0) {
        return res.render('register', {
            errors,
            name,
            email,
            password,
            confirm_password
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('register', {
                errors,
                name,
                email,
                password,
                confirm_password
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log('New user registered:', newUser);
        res.redirect('/user/login');
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).send('Server Error');
    }
});

// Login route (POST)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    try {
        const user = await User.findOne({ email });
        if (!user) {
            errors.push({ msg: 'User does not exist' });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                errors.push({ msg: 'Incorrect Password' });
            }
        }

        if (errors.length > 0) {
            return res.render('login', {
                errors,
                email,
                password
            });
        }
req.session.user={
    name:user.name,
    email:user.email
}
        res.redirect('/user/dashboard');
    } catch (err) {
        console.error('Error during user login:', err);
        res.status(500).send('Server Error');
    }
});



// Dashboard route
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        
        return res.redirect('/user/login');
    }
    // console.log(req.session.user.name);

    res.render('dashboard', { user: req.session.user });
});




module.exports = router;
