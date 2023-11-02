const express = require('express')
const { registerUser, loginUser, getAllUsers,createUser, updateUser, deleteUser  } = require('../controllers/user.controller')
const router  = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/all', getAllUsers )
router.post('/', createUser )
router.put('/:id', updateUser )
router.delete('/:id', deleteUser )

module.exports = router