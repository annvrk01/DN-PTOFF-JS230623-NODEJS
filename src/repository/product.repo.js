const connection = require('../config/dbconfig');


let repoGetAllProducts = function() {
  let query = "SELECT * FROM products;"
  return queryPromise(query)
};

let repoGetProduct = function(id){
  let query = "SELECT * FROM products WHERE id = " + id + ";";

  return queryPromise(query)
}

let repoInsertProduct = function (product) { 
  product.categoryId = product.categoryId || "0"

  let query = "INSERT INTO products " 
  + "(name, unitprice, categoryId) "
  + " VALUES "
  + "( '" + product.name + "','" + product.unitprice + "', '" + product.categoryId + "' );";

  return queryPromise(query)
}

let repoUpdateProduct = function(id, product){
  let query = "UPDATE products " 
  + "set name = '" + product.name 
  + "', unitprice = '" + product.unitprice 
  + "', categoryId  = '" + product.categoryId + "'"
  + " WHERE id = '" + id + "';";

  return queryPromise(query)
}

let repoDeleteProduct = function(id){
  let query = "DELETE FROM products " 
  + "WHERE id = '" + id + "';";

  return queryPromise(query)
}

let c = function(){
  
}
let d = function(){
  
}
let e = function(){
  
}
let f = function(){
  
}

module.exports = {repoGetAllProducts, repoGetProduct, repoInsertProduct, repoUpdateProduct,b: repoDeleteProduct,c,d,e,f}

let queryPromise = function(query){  
  return new Promise(function(res,rej){
    connection.query(query, (err, rows, columnInfos) => {
        if(err) return rej(err);
        res(rows, columnInfos);

    });        
  });
}
