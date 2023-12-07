const connection = require('../config/dbconfig');


let repoGetAllCarts = function () {
  //let query = "SELECT * FROM carts;"
  let query = ` 
SELECT 
  carts.id, username, 
  group_concat(products.title_text SEPARATOR ', ') as productnames, 
  group_concat(products.id SEPARATOR ', ') as productids,
  sum(price) as totalprice,
  carts.date_added, carts.date_updated
FROM
  root.carts
      INNER JOIN
  root.users ON carts.userId = users.id
      INNER JOIN
  root.cartAndProduct ON carts.id = cartAndProduct.cartId
      INNER JOIN
  root.products ON cartAndProduct.productId = products.id
  GROUP BY carts.id;`

  return queryPromise(query)
};

let a = function () {

}
let b = function () {

}
let c = function () {

}
let d = function () {

}
let e = function () {

}
let f = function () {

}

module.exports = { repoGetAllCarts, a, b, c, d, e, f }

let queryPromise = function (query, value) {
  if (value) {
    return new Promise(function (res, rej) {
      connection.query(query, [value], (err, rows, columnInfos) => {
        if (err) return rej(err);
        res(rows, columnInfos);
      });
    });
  }
  return new Promise(function (res, rej) {
    connection.query(query, (err, rows, columnInfos) => {
      if (err) return rej(err);
      res(rows, columnInfos);

    });
  });
}
