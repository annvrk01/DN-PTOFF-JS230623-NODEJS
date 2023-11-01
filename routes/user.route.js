const express = require('express')
const { registerUser, loginUser, getAllUsers, searchUsers, updateUser, deleteUser  } = require('../controllers/user.controller')
const router  = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/all', getAllUsers )
router.get('/search', searchUsers )
router.put('/:id', updateUser )
router.delete('/:id', deleteUser )

module.exports = router