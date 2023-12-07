const express = require("express");
const router = express.Router();
const multer = require('multer');
const { getMatchingcart } = require("../controllers/cart.controller");

router.get('/', getMatchingcart);
router.get('/:productId', () => {});
router.post('/', () => {});
router.put('/:id', () => {});
router.delete('/:id', () => {})

module.exports = router
