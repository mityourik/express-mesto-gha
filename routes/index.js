const { Router } = require('express');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const notFoundRouter = require('./notFoundPages');
const validate = require('../middlewares/joiValidation');
const { createUserSchema, loginSchema } = require('../utils/validationScheme');

const router = Router();

router.post('/signup', validate(createUserSchema), createUser);
router.post('/signin', validate(loginSchema), login);

router.use(auth);

router.use(usersRouter);
router.use(cardsRouter);
router.use(notFoundRouter);

module.exports = router;
