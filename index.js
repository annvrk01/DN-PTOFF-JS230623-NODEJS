const http = require('http')
const url = require('url')
const fs = require("fs")
const path = require("path")


const data = fs.readFileSync("content.txt", "utf-8")

// hướng dẫn new 1 file log
const action_logs = [
  {
    action_name: "login",
    action_value: "",
    user_id: 0,
    created_time_stamp: new Date(),
  }
];
let now = new Date();
let nowAsString = now.toISOString().split('T')[0];
let nameFile = "log-" + nowAsString;
fs.writeFileSync(nameFile + ".txt", JSON.stringify(action_logs));


const server = http.createServer((request, response) => {
  const { pathname, query } = url.parse(request.url, true)
  const extName = path.extname(pathname);
  let contentType = null;

  switch (extName) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  response.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' })
  fs.readFile("./" + pathname, (error, data) => {
    if (error) {
      console.log('error ', pathname)
    } else {
      response.write(data)
    }
    response.end();
  })
})

server.listen(8000, '127.0.0.1', () => {
  console.log("Start server  127.0.0.1:8000 ")
})