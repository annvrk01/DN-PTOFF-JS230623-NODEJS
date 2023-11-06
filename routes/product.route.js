const express = require("express");
//const checkLogin = require("../middleware/checkUser.middleware");
const { getProducts, createProduct, updateProducts,deleteProduct, getProductById} = require("../controllers/product.controller");
const router = express.Router();

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProducts);
router.delete('/:id', deleteProduct)

module.exports = router