const { Router } = require('express');
const router = Router();

const { login, logout, isLoggedIn, sendEmail, codeVerification, doLockUser } = require('../controllers/SessionController');

router.route('/login') // everytime this file is executed
    .post(login);

router.route('/logout')
    .post(logout);

router.route('/isLoggedIn')
.post(isLoggedIn);

router.route('/email')
    .put(sendEmail);
    
router.route('/codeVerification')
    .get(codeVerification);

router.route('/lock')
    .put(doLockUser);

module.exports = router;