const express = require('express');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
const updateUserById = require('../controllers/user_controller');

const router = express.Router();


/**
 * @desc     Update User Info
 * @route    /api/users/:id
 * @methods  PUT
 * @access   private
 */
router.put('/:id', verifyTokenAndAuthorization, updateUserById);

module.exports = router;