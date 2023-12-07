const express = require("express");
//const checkLogin = require("../middleware/checkUser.middleware");
const { getProducts, getMatchingProduct, createProduct, addProductImage, updateProducts,deleteProduct, getProductById} = require("../controllers/product.controller");
const router = express.Router();
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, "AtMS" + Date.now() + '.jpg') //Appending .jpg
  }
})
const upload = multer({ storage: storage });

router.post('/images', upload.single('productImage'), addProductImage);

router.get('/', getMatchingProduct);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProducts);
router.delete('/:id', deleteProduct)

module.exports = router