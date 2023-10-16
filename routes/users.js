const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');
const { getUserByIdSchema, updateUserProfileSchema, updateUserAvatarSchema } = require('../validationSchemas/joiValidationSchemas');

router.get('/users/me', getUserInfo);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserByIdSchema, getUserById);
router.patch('/users/me', updateUserProfileSchema, updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatarSchema, updateUserAvatar);

module.exports = router;
