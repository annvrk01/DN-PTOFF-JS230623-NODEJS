const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    if (req.query.email === "nguyenvanan@gmail.com") {
        res.json("Dang nhap thanh cong")
    }
    res.json("Dang nhap that bai")
})

router.get("/user", (req, res) => {
    const users = [
        {
            id: 1,
            name: "Nguyen Van B",
            email: "nguyenva@gmail.com"
        },
        {
            id: 2,
            name: "Nguyen Van B",
            email: "nguyenva@gmail.com"
        }
    ]
    console.log("search :", req.query.search)
    res.json(users)
})

router.post('/user', (req, res) => {
    console.log(req.body)
    res.send('Dang ky thanh cong')
})

router.put('/user/:id', (req, res) => {
    if(Number(req.params.id) === 2){
        res.send('Chinh sua thanh cong ' + req.params.id)
    }
    res.json("Chinh sua that bai")
})

router.delete('/', (req, res) => {
    res.send('Got a DELETE request')
})

module.exports = router;