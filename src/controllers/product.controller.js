const fs = require('fs');
const { repoGetProduct, repoInsertProduct, repoUpdateProduct, repoGetAllProducts } = require('../repository/product.repo');
const { validateProductSortParam, matchedKey } = require('../Utils');

const PAGE_SIZE = 20;

const getProducts = async (req, res) => {
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Get all products'
    // #swagger.description = 'Retrieve all products in database'
    console.log("getProducts");
    const {id} = req.params;

    let products = await ((id) ? repoGetProduct(id) : repoGetAllProducts());
    //console.log("products ", products)
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
    let products = repoGetProduct(productId)
    if (!productId) {
        res.status(400);
        res.send(" Giá trị ID không hợp lệ");
    }
    res.status(400).json(products)
}

const createProduct= (req,res)=>{
    // #swagger.tags = ['Product']
    // #swagger.summary = 'Create Product'
    // #swagger.description = 'Create Product description'
    const {name, unitprice, categoryId } = req.body    
    const product = {
        name: name,
        unitprice : unitprice,
        categoryId : categoryId
    }
    let any = repoInsertProduct(product);
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
    let any = repoUpdateProduct(productId, productReq)
    res.status(200).json(productReq);
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
    let any = deleteProduct(productId)
    res.status(200).json("Xóa thành công");
}


var cached_selectAllProduct = null;
var productCacheIter = null;

const getMatchingProduct = async (req, res) => {
    let { key, page, size, sort } = req.query;
    console.log("getMatchingProduct, query = ", req.query);
    page = Number(page);
    if (!page || isNaN(page) || page <= 0) {
        page = 1;
    }

    if (!size || isNaN(size)) {
        size = 10;
    }

    const pageSize = Number(size);

    let { sortOrder, sortBy } = validateProductSortParam(sort);

    if(!cached_selectAllProduct){
        if(productCacheIter) {
            clearInterval(productCacheIter);
            productCacheIter = null;
        }
        cached_selectAllProduct = await repoGetAllProducts();
        productCacheIter = setInterval(
            () => {
                cached_selectAllProduct = null;
                clearInterval(productCacheIter);
            }, 8000
        );
    }
      
    let pagedProducts = [...cached_selectAllProduct];

    if (key) {
        pagedProducts = pagedProducts.filter((product) => {
            return matchedKey(product.title_text, key)
                || matchedKey(product.desc_text, key)
                || matchedKey(product.price, key);
        })
        //console.log("pagedUsers matched key: ", pagedUsers)
    }
    let totalFound = pagedProducts.length;

    //console.log("sortOrder ", sortOrder)
    //console.log("sortBy ", sortBy)
    pagedProducts = pagedProducts.sort(
        (productA, productB) => {
            let compareElementA = productA[sortBy] || "";
            let compareElementB = productB[sortBy] || "";

            if (sortOrder === "asc") {
                return compareElementA.localeCompare(compareElementB);
            }
            return -(compareElementA.localeCompare(compareElementB));
        }
    );
    //console.log("pagedUsers with pageSize: ", pagedUsers)



    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + (pageSize - 1);
    //console.log("startIndex ", startIndex)
    //console.log("endIndex ", endIndex)
    pagedProducts = pagedProducts.slice(startIndex, endIndex + 1);
    //console.log("pagedUsers sorted", pagedUsers)

    pagedProducts.forEach(
        user => {
            user.password = "HIDDEN";
        }
    );

    return res.status(200).json({
        content: pagedProducts,
        pageIndex: Math.floor(startIndex / pageSize) + 1,
        totalElements: totalFound,
        totalPages: Math.ceil(totalFound / pageSize),
        size: pageSize,
        sortOrder: sortOrder,
        sortBy: sortBy,
        searchKey: key,
    });
}

module.exports = {getProducts, getProductById, createProduct,updateProducts,deleteProduct, getMatchingProduct }
