const express = require("express")
const app = express();
const router = require("./src/routes/router.js");
const productRouter = require("./src/routes/product.route.js");
const userRouter = require("./src/routes/user.route.js");
const pagesRouter = require("./src/routes/pages.route.js");

// npm install --save body-parser
var bodyParser = require('body-parser')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))
const port = 8000

app.use("/api", router)
app.use("/api/user", userRouter)
app.use("/api/products", productRouter)

app.use("/views", pagesRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set("view engine", "ejs")
app.set('views',"./src/views", 'views'); 

app.listen(port, () => {
    console.log("Start serrver")
})