const { Router } = require('express');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const notFoundRouter = require('./notFoundPages');
const { createUserSchema, loginSchema } = require('../utils/validationScheme');

const router = Router();

router.post('/signup', createUserSchema, createUser);
router.post('/signin', loginSchema, login);

router.use(auth);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use(notFoundRouter);

module.exports = router;
