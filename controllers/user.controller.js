const fs = require('fs')

// API Đăng ký
const registerUser = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Register User'
    // #swagger.description = 'Register user description'
    const { username, email, password } = req.body // get data request 
    let message = {
        username: '',
        email: '',
        password: '',
    }
    let isValidate = false

    if (!username || username.trim().length < 3) {
        message.username = 'User phải trên 3 ký tự.'
        isValidate = true
    }

    if (!email || !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim())) {
        message.email = 'Email không hợp lệ.'
        isValidate = true
    }

    if (!password || password.trim().length < 8) {
        message.password = 'Password phải trên 8 ký tự.'
        isValidate = true
    }

    if (isValidate) {
        res.status(400).json(message)
    }

    // get data từ file json
    let users = JSON.parse(fs.readFileSync('data/users.json'))
    // findIndex tìm vị trí phần tử đầu tiên trong mãng thảo mãng điều kiện
    const userExisted = users.findIndex(user => user.email === email)

    if (userExisted !== -1) res.status(400).json({
        message: 'Tài khoản đã tồn tại.'
    })

    const user = {
        id: Math.floor(Math.random() * 1000),
        username: username,
        email: email,
        password: password
    }
    users.push(user)
    fs.writeFileSync('data/users.json', JSON.stringify(users))

    res.status(200).json({
        message: 'Đăng ký thành công',
        data: req.body
    })
}

// API login
const loginUser = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Login User'
    // #swagger.description = 'Login user description'
    const { email, password } = req.body

    let message = {
        username: '',
        email: '',
        password: '',
    }
    let isValidate = false

    if (!email || !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim())) {
        message.email = 'Email không hợp lệ.'
        isValidate = true
    }

    if (!password || password.trim().length < 8) {
        message.password = 'Password phải trên  8 ký tự.'
        isValidate = true
    }

    const users = JSON.parse(fs.readFileSync('data/users.json'))
    const user = users.find(user => user.email === email)

    if (!user) res.status(400).json({
        message: 'Tài khoản không tồn tại.'
    })

    if (user.password !== password) {
        message.password = 'Password không chính xác.'
        isValidate = true
    }

    if (isValidate) {
        res.status(400).json(message)
    }

    res.status(200).json({
        message: 'Đăng nhập thành công',
        data: {
            email: email
        }
    })
}

// API get danh sách User
const getAllUsers = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get User'
    // #swagger.description = 'Get user description'
    let { keyword, page, size } = req.query;
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    // TODO
    res.status(200).json({
        content: users,
        totalElements: users.length,
        totalPages: 5,
        size: 1
    });
}

// API create User
const createUser = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Create User'
    // #swagger.description = 'Create user description'
    const { username, email, password } = req.body // get data request 
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    const user = {
        id: Math.floor(Math.random() * 1000),
        username: username,
        email: email,
        password: password
    }
    users.push(user)
    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.status(200).json(user);
}

// API xóa User
const deleteUser = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete User'
    // #swagger.description = 'Delete user description'
    let userId = req.params.id;
    if (!userId) {
        res.status(400);
        res.send("Giá trị Id không hợp lệ");
    }
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    const indexUser = users.findIndex(user => Number(user.id) === Number(userId))
    if (indexUser === -1) {
        res.status(400).send("Id không tồn tại : " + userId);
    }
    users.splice(indexUser, 1);
    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.status(200).json("Xóa thành công");
}

// API chỉnh sửa User 
const updateUser = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update User'
    // #swagger.description = 'Update user description'
    let userId = req.params.id;
    let userReq = req.body;
    if (!userId) {
        res.status(400);
        res.send(" Giá trị ID không hợp lệ");
    }
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    const indexUser = users.findIndex(user => Number(user.id) === Number(userId))
    if (indexUser === -1) {
        res.status(400).send("Id: " + userId + "không tồn tại. ");
    }
    let user = users[indexUser]
    user.username = userReq.username
    user.email = userReq.email
    // tương tự set các trường hợp khác 
    users[indexUser] = user;
    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.status(200).json(user);
}

module.exports = { registerUser, loginUser, createUser, getAllUsers, updateUser, deleteUser }