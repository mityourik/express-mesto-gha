const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserInfo,
  createUser,
  login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.get('/users/me',  getUserInfo);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
