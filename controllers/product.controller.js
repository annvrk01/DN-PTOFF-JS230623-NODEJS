const getProducts = (req, res) => {
    console.log("API 2")
    const products = [
        {
            id: 1,
            name: 'Sp A',
            price: 1000
        },
        {
            id: 2,
            name: 'Sp B',
            price: 1500
        },
        {
            id: 3,
            name: 'Sp C',
            price: 2000
        },
    ]

    res.json(products)
}

const updateProducts= (req, res) => {
    if (Number(req.params.id) === 2) {
        res.send('Chinh sua product thanh cong ' + req.params.id)
    }
    res.json("Chinh sua product that bai")
}

module.exports = {getProducts, updateProducts}