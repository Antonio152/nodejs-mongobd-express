const { Router } = require('express');
const router = Router();

const { getCard } = require('../controllers/cardController');

router.route('/') // everytime this file is executed
    .post(getCard);


module.exports = router;