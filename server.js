const express = require("express")
const app = express();
const router = require("./router.js");
// npm install --save body-parser
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))
const port = 8000

app.use("/api", router)

app.listen(port, () => {
    console.log("Start serrver")
})