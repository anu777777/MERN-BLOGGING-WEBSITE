const express = require('express')
const { getAllUsers, registerController, loginController } = require('../controllers/userControllers')

const router = express.Router()


//get all users || GET
router.get('/all-users', getAllUsers);

//Register all users || POST
router.post('/register', registerController);

//Login all users || POST
router.post('/login', loginController);

module.exports = router;