const fs = require('fs')
const bcrypt = require('bcrypt');
const connection = require('./../config/database.config')
const { getUsers, findAllUsers, findById, insertUser, updateUserById, deleteUserById, findAllUsersCount } = require('./../repository/user.repository')

const COOKIE_NAME = 'user-cookie';

// API login
const loginUser = async (req, res) => {
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

    const users = await getUsers(email, password);
    if (!users || users.length === 0) {
        res.status(404).json({
        });
    }

    res.cookie(COOKIE_NAME, users[0]);
    res.status(200).json({
        data: users
    })
}

const getViewUser = (req, res) => {
    // console.log("getView")
    // res.render('pages/users', {
    //     username: 'Nguyen Van A',
    //     num1: 10,
    //     num2: 5,
    //     arrayNumber: [0, 1, 2, 3, 4, 5, 6, 7, 8, 100, 200]
    // });
}

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
    // fs.writeFileSync('data/users.json', JSON.stringify(users))

    res.status(200).json({
        message: 'Đăng ký thành công',
        data: req.body
    })
}

// API get danh sách User
const getAllUsers = async (req, res) => {
    let params = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        userName: req.query.userName,
        email: req.query.email,
        phoneNumber: req.query.phoneNumber,
        limit :  req.query.limit,
        page :  req.query.page
    }
    params.offset= (params.page -1 ) * params.limit
    const users = await findAllUsers(params)
    const dataCount = await findAllUsersCount(params)
    console.log('count', dataCount[0]['COUNT(id)'])

    
    res.status(200).json({
        data: users,
        count:dataCount[0]['COUNT(id)'] 
    })
};

const getById = async (req, res) => {
    let userId = req.params.id;
    if (!userId) {
        res.status(400);
        res.send("Giá trị Id không hợp lệ");
    }
    const user = await findById(userId)
    res.status(200).json({
        data: user[0]
    })
}

// API create User
const createUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Create User'
    // #swagger.description = 'Create user description'
    const { username, email, password } = req.body // get data request 
    const saltRounds = 5;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const user = {
        userName: username,
        email: email,
        password: hash,
        is_actived : 1
    }
    let any = await insertUser(user);
    res.status(200).json(user);
}

// API xóa User
const deleteUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete User'
    // #swagger.description = 'Delete user description'
    let userId = req.params.id;
    if (!userId) {
        res.status(400);
        res.send("Giá trị Id không hợp lệ");
    }
    await deleteUserById(userId)
    res.status(200).json("Xóa thành công");
}

// API chỉnh sửa User 
const updateUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update User'
    // #swagger.description = 'Update user description'
    let userId = req.params.id;
    let userReq = req.body;
    if (!userId) {
        res.status(400);
        res.send(" Giá trị ID không hợp lệ");
    }
    const user = await findById(userId)
    if (!user) {
        res.status(400).send("User không tồn tại. ");
    }
    const userUpdate = { ...user[0], ...userReq }
    await updateUserById(userUpdate, userId)
    res.status(200).json({
        message: 'success',
        data: userUpdate
    });
}

module.exports = { registerUser, loginUser, createUser, getAllUsers, updateUser, deleteUser, getViewUser, getById }