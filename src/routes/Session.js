const { Router } = require('express');
const router = Router();

const { login, logout, isLoggedIn } = require('../controllers/SessionController');

router.route('/login') // everytime this file is executed
    .post(login);

router.route('/logout')
    .post(logout);

router.route('/isLoggedIn')
    .post(isLoggedIn);

module.exports = router;