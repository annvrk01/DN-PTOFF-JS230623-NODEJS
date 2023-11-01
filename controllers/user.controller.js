const fs = require('fs')

const registerUser = (req, res) => {
    const { username, email, password } = req.body
    let message = {
        username: '',
        email: '',
        password: '',
    }
    let isValidate = false

    if (!username || username.trim().length < 3) {
        message.username = 'user phai tren 3 ky tu.'
        isValidate = true
    }

    if (!email || !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim())) {
        message.email = 'email khong hop le.'
        isValidate = true
    }

    if (!password || password.trim().length < 8) {
        message.password = 'password phai tren 8 ky tu.'
        isValidate = true
    }

    if (isValidate) {
        res.status(400).json(message)
    }

    let users = JSON.parse(fs.readFileSync('data/users.json'))

    const userExisted = users.findIndex(user => user.email === email)

    if (userExisted !== -1) res.status(400).json({
        message: 'Tai khoan da ton tai.'
    })

    const user = {
        username: username,
        email: email,
        password: password
    }
    users.push(user)
    fs.writeFileSync('data/users.json', JSON.stringify(users))

    res.status(200).json({
        message: 'Dang ky thanh cong',
        data: req.body
    })
}

const loginUser = (req, res) => {
    const {email, password} = req.body

    let message = {
        username: '',
        email: '',
        password: '',
    }
    let isValidate = false

    if (!email || !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim())) {
        message.email = 'email khong hop le.'
        isValidate = true
    }

    if (!password || password.trim().length < 8) {
        message.password = 'password phai tren 8 ky tu.'
        isValidate = true
    }

    const users =JSON.parse(fs.readFileSync('data/users.json'))
    const user = users.find(user => user.email === email)

    if (!user) res.status(400).json({
        message: 'Tai khoan khong ton tai.'
    })

    if(user.password !== password) {
        message.password = 'password khong chinh xac.'
        isValidate = true
    }

    if (isValidate) {
        res.status(400).json(message)
    }

    res.status(200).json({
        message: 'Dang nhap thanh cong',
        data: {
            email: email
        }
    })
}

const getAllUsers = (req, res) => {
    let users = JSON.parse(fs.readFileSync('data/users.json'));
    res.json(users);
}

const doesStringHasKeyword = (anyString, keyword) => {
    if(anyString === undefined){
        return false;
    }
    return anyString.toLowerCase().includes(keyword);
}

const isInvalid = (any) => {
    return any !== 0 && (!any || isNaN(any));
}

const RESULT_PER_PAGE = 3;

const searchUsers = (req, res) => {
    let users = JSON.parse(fs.readFileSync('data/users.json'));

    let keyword = req.query.keyword;
    let pageIdx = req.query.page;
    let limit = req.query.limit;
    
    pageIdx = Math.max(pageIdx, 0);

    let results = [];
    let allFound = [];
    let foundIdx = -1;
    users.forEach(
        each => {
            let found = doesStringHasKeyword(each.username, keyword)
            || doesStringHasKeyword(each.realname, keyword)
            || doesStringHasKeyword(each.role, keyword)
            || doesStringHasKeyword(each.email, keyword)

            if(!found) return;

            allFound.push(each);

            foundIdx++;

            if(isInvalid(pageIdx)){
                //once pageIdx is invalid, return all results, ignore paging...
                results.push(each);
                return;
            }

            let currentPageIdx = Math.floor(foundIdx / RESULT_PER_PAGE);
            if(currentPageIdx === pageIdx){
                results.push(each);
                return;
            }
        }
    );

    if(limit < results.length){
        results.length = limit;
    }

    let totalPages = Math.ceil(allFound.length / RESULT_PER_PAGE);

    let paging_result = {
        content: results,
        totalElements: allFound.length,
        totalPages: totalPages,
        size: RESULT_PER_PAGE
    }

    res.json(paging_result);
}

const updateUser = (req, res) => {
    let userId = req.params.id;
    let newUserObject = req.body;

    if(isInvalid(userId)){
        res.status(400);
        res.send("INVALID PARAMS, expected id to be a number, got: " + userId);
    }
    
    let users = JSON.parse(fs.readFileSync('data/users.json'));

    let onSuccess = (newUserObject, arrayIdx) => {
        newUserObject.id = users[arrayIdx].id;
        users[arrayIdx] = newUserObject;

        fs.writeFileSync('data/users.json', JSON.stringify(users));

        res.status(200);
        res.json(users[arrayIdx]);        
    }

    let onFailure = (userId) => {
        res.status(400);
        res.send("NO SUCH USER WITH ID: " + userId);
    }

    let foundAt = -1;
    userId = Number(userId);
   //  const userExisted = users.findIndex(user => user.email === email)
    users.every(
        (each, arrayIdx) => {
            if(each.id === userId){
                foundAt = arrayIdx;
                return false;
            }
            return true;
        }
    );

    if(foundAt >= 0){
        onSuccess(newUserObject, foundAt);
    }
    else{
        onFailure(userId);
    }
}

const deleteUser = (req, res) => {
    let userId = req.params.id;

    if(isInvalid(userId)){
        res.status(400);
        res.send("INVALID PARAMS, expected id to be a number, got: " + userId);
    }
    
    let onSuccess = (arrayIdx) => {
        users.splice(arrayIdx, 1)

        fs.writeFileSync('data/users.json', JSON.stringify(users));

        res.status(200);
        res.json("SUCCESS");        
    }

    let onFailure = (userId) => {
        res.status(400);
        res.send("NO SUCH USER WITH ID: " + userId);
    }

    let users = JSON.parse(fs.readFileSync('data/users.json'));

    let foundAt = -1;
    userId = Number(userId);
    users.every(
        (each, arrayIdx) => {
            if(each.id === userId){
                foundAt = arrayIdx;
                return false;
            }
            return true;
        }
    );

    if(foundAt >= 0){
        onSuccess(foundAt);
    }
    else{
        onFailure(userId);
    }
}

module.exports = { registerUser , loginUser, getAllUsers, searchUsers, updateUser, deleteUser}