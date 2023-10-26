const http = require('http')
const url = require('url')

// khởi tạo 1 máy chủ HTTp
const server = http.createServer((request, response) => {

  // Set response status , type
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  response.write("<h1> Hello An </h1>");
  const { pathname, query } = url.parse(request.url, true)

  if (pathname === "/") {
    response.write("<h1>Trang chủ </h1>")
  } else if (pathname === "/products") {
    response.write("<h1> Danh sách Products </h1>")
  }else if (pathname === "/users") {
    response.write("<h1> Danh sách Users </h1>")
  }
  response.end();
})

// khởi động server port 8000
server.listen(8000, '127.0.0.1', () => {
  console.log("Start server  http://localhost:8000 ")
})