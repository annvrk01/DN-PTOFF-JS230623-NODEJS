const express = require("express")
const app = express();
const router = require("./routes/router.js");
const productRouter = require("./routes/product.route.js");
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
app.use("/api/products", productRouter)


const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'Test API ',
        description: '',
    },
    tags: [ ],
    host: 'localhost:8000/api',
    schemes: ['http', 'https'],
};

// swaggerAutogen(outputFile, endpointsFiles, config);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log("Start serrver")
})