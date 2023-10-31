const express = require("express");
const checkLogin = require("../middleware/checkUser.middleware");
const { getProducts , updateProducts} = require("../controllers/product.controller");
const router = express.Router();

router.get('/', checkLogin, getProducts)

router.post('/', (req, res) => {
    console.log(req.body)
    res.json('dang ky thanh cong')
})

router.put('/:id', updateProducts)

router.delete('/:id', (req, res) => {
    if (Number(req.params.id) === 2) {
        res.send('ok ' + req.params.id)
    }
    res.status(400)
    res.json("ko ok")
})

module.exports = router