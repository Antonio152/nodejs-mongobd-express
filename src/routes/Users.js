const { Router } = require('express');
const router = Router();
const access = require('../services/auth')//Falta incluir 'access.isAuth' en la url
const { createUser, findAll, findAllPublished, findOne, update, deleteAll, deleteUser } = require('../controllers/usersController');

router.route('/') // everytime this file is executed
    .get(findAll)
    .post(createUser)
    .delete(deleteAll);

router.route('/:id')
    .get(findOne)
    .put(update)
    .delete(deleteUser);

router.route('/published')
    .get(findAllPublished);

module.exports = router;