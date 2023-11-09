const fs = require('fs');

const PAGE_SIZE = 20;

const getProducts = (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Get all products'
    // #swagger.description = 'Retrieve all products in database'
    const {id} = req.params;
    let products = JSON.parse(fs.readFileSync('data/products.json'));
    //get all user
    let pageCount = Math.ceil(products.length / PAGE_SIZE);

    res.status(200).json({
        content: products,
        totalElements: products.length,
        totalPages: pageCount,
        size: PAGE_SIZE
    });
}

const getProductById = (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Get product by Id'
    // #swagger.description = 'Get product by Id description'
    const {productId} = req.params 
    let products = JSON.parse(fs.readFileSync('data/products.json'));

    const product = products.find(product => product.id === Number(productId))

    if (!productId) {
        res.status(400);
        res.send(" Giá trị ID không hợp lệ");
    }

    res.status(400).json(product)
}

const createProduct= (req,res)=>{
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Create Product'
    // #swagger.description = 'Create Product description'
    const {name, quantity, unitPrice,categoryId } = req.body
    const products = JSON.parse(fs.readFileSync('data/products.json'));
    const product = {
        name: name,
        quantity : quantity,
        unitPrice : unitPrice,
        categoryId : categoryId
    }
    products.push(product)
    fs.writeFileSync('data/products.json', JSON.stringify(products));
    res.status(200).json(product)
}

const updateProducts = (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Update Product'
    // #swagger.description = 'Update Product description'
    let productId = req.params.id;
    let productReq = req.body;
    if (!productId) {
        res.status(400);
        res.send(" Giá trị ID không hợp lệ");
    }
    let products = JSON.parse(fs.readFileSync('data/products.json'));
    const indexProduct = products.findIndex(product => Number(product.id) === Number(productId))
    if (indexProduct === -1) {
        res.status(400).send("Id: " + productId + "không tồn tại. ");
    }
    let product = products[indexProduct]
    product.name = productReq.name

    // tương tự set các trường hợp khác 
    products[indexProduct] = product;
    fs.writeFileSync('data/products.json', JSON.stringify(products));
    res.status(200).json(product);
}
const deleteProduct =(req,res)=>{
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Delete product'
    // #swagger.description = 'Delete product description'
    let productId = req.params.id;
    if (!productId) {
        res.status(400);
        res.send("Giá trị Id không hợp lệ");
    }
    let products = JSON.parse(fs.readFileSync('data/products.json'));
    const indexProduct = products.findIndex(product => Number(product.id) === Number(productId))
    if (indexProduct === -1) {
        res.status(400).send("Id không tồn tại : " + productId);
    }
    products.splice(indexProduct, 1);
    fs.writeFileSync('data/products.json', JSON.stringify(products));
    res.status(200).json("Xóa thành công");
}


module.exports = {getProducts,getProductById, createProduct,updateProducts,deleteProduct }