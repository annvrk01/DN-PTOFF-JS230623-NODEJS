const http = require('http')
const url = require('url')

// khởi tạo 1 máy chủ HTTp
const server = http.createServer((request, response) => {

  // Set response status , type
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  response.write("<h1> Hello An </h1>");
  const { pathname, query } = url.parse(request.url, true)

  console.log('query', query)

  if (request.method == "POST") {
    let data = "";
    request
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        // console.log(chunk);
        data += chunk.toString();
      })
      .on("end", () => {
       
      });
  }

  let html = '';
  if (pathname === "/") {
    response.write("<h1>Trang chủ </h1>")
  } else if (pathname === "/products") {
    response.write("<h1> Danh sách Products </h1>")
  } else if (pathname === "/users") {
    response.write("<h1> Danh sách Users </h1>")

    html += `
    <form action="http://localhost:8000/users" method="GET">
        <input type="text" name="keyword" placeholder="Từ khóa" />
        <input type="text" name="name" placeholder="Từ khóa" />
        <button type="submit"> Tìm Kiếm </button>
        <p> Từ khóa ${query?.keyword}  </p>
    </form>
`
  }
  response.write(html)


  response.end();
})

// khởi động server port 8000
server.listen(8000, '127.0.0.1', () => {
  console.log("Start server  http://localhost:8000 ")
})