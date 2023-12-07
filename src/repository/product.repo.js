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
  product.categoryId = product.categoryId || "0";

  let polygon_count = 0;
  let vertices_count = 0;
  let has_textures = 1;
  let has_material = 1;
  let had_rigged = 1;
  let had_animated = 1;
  let had_UVMapped = 1;
  let is_gameReady = 1;

  let query = `INSERT INTO products  
    (title_text, desc_text, likes_count, visit_count, download_count, price, geometry)
    VALUES (?) `;

  let values = [product.title_text, product.desc_text, 
    0, 0, 0, 
    Number(product.price) || 0, product.geometry];
  return queryPromise(query, values);
}

let repoUpdateProduct = function(id, product){
  let query = `UPDATE products  
  SET title_text = '` + product.title_text 
  + `', desc_text = '` + product.desc_text 
  + `', price = ` + product.price 
  + `, geometry = '` + product.geometry + `'
  WHERE id = ` + id + `;`;

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

module.exports = {repoGetAllProducts, repoGetProduct, repoInsertProduct, repoUpdateProduct,repoDeleteProduct,c,d,e,f}

let queryPromise = function(query, value){ 
  if (value){    
    return new Promise(function(res,rej){
      connection.query(query, [value], (err, rows, columnInfos) => {
          if(err) return rej(err);
          res(rows, columnInfos);
      });        
    });
  } 
  return new Promise(function(res,rej){
    connection.query(query, (err, rows, columnInfos) => {
        if(err) return rej(err);
        res(rows, columnInfos);

    });        
  });
}
