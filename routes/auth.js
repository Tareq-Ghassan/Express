const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');


const router = express.Router();

router.get('/login',authController.getLoginPage)
 
router.post('/login',
    [     
        check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.').trim(),
    ],
    authController.postLogin
)

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [     
        check('email').isEmail().withMessage('Please enter a valid email.'),
        body('email').custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists!');
                }
            });
        }).normalizeEmail(),
        check('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
        body('confirmPassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        }),
    ],
    authController.postSignup
);

router.post('/logout',authController.postLogout)

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;