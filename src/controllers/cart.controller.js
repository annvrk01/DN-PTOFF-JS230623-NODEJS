const fs = require('fs');

const { validateCartSortParam, matchedKey } = require('../Utils');
const multer = require('multer');
const { repoGetAllCarts } = require('../repository/cart.repo');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, "AtMS" + Date.now() + '.jpg') //Appending .jpg
  }
})
const upload = multer({ storage: storage });

const PAGE_SIZE = 20;

var cached_selectAllCarts = null;
const clearCache = () => {
    cached_selectAllCarts = null;
}
var cartCacheIter = null;

const getMatchingcart = async (req, res) => {
    let { key, page, size, sort } = req.query;
    console.log("getMatchingcart, query = ", req.query);
    page = Number(page);
    if (!page || isNaN(page) || page <= 0) {
        page = 1;
    }

    if (!size || isNaN(size)) {
        size = 10;
    }

    const pageSize = Number(size);

    let { sortOrder, sortBy } = validateCartSortParam(sort);

    if(!cached_selectAllCarts){
        if(cartCacheIter) {
            clearInterval(cartCacheIter);
            cartCacheIter = null;
        }
        cached_selectAllCarts = await repoGetAllCarts();
        cartCacheIter = setInterval(
            () => {
                cached_selectAllCarts = null;
                clearInterval(cartCacheIter);
            }, 8000
        );
    }
      
    let pagedCarts = [...cached_selectAllCarts];

    if (key) {
        pagedCarts = pagedCarts.filter((cart) => {
            return matchedKey(cart.username, key)
                //|| matchedKey(cart.productname, key)
        })
    }
    let totalFound = pagedCarts.length;
    pagedCarts = pagedCarts.sort(
        (cartA, cartB) => {
            let compareElementA = (cartA[sortBy]) ? cartA[sortBy].toString() : "";
            let compareElementB = (cartB[sortBy]) ? cartB[sortBy].toString() : "";

            if (sortOrder === "asc") {
                return compareElementA.localeCompare(compareElementB);
            }
            return -(compareElementA.localeCompare(compareElementB));
        }
    );
    //console.log("pagedUsers with pageSize: ", pagedUsers)



    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + (pageSize - 1);
    pagedCarts = pagedCarts.slice(startIndex, endIndex + 1);

    return res.status(200).json({
        content: pagedCarts,
        pageIndex: Math.floor(startIndex / pageSize) + 1,
        totalElements: totalFound,
        totalPages: Math.ceil(totalFound / pageSize),
        size: pageSize,
        sortOrder: sortOrder,
        sortBy: sortBy,
        searchKey: key,
    });
}

module.exports = {getMatchingcart}
