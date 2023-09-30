const express = require('express');

const router = express.Router();
const { getAllUsers, getUserById, createUser } = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.get('/users', createUser);

module.exports = router;
