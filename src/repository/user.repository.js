const connection = require("../config/database.config");

let getUsers = (email, password) => {
    const query = "SELECT * from users WHERE email = '"+ email+"' AND password ='"+ password+"'"
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
           
        });
    })
};

let findAllUsers = (params) => {
    let query = "SELECT id,  first_name, last_name, username, email, phone_number FROM users WHERE is_actived = 1 ";
    if(params.email){
        query+= " AND email = "+"'" + params.email + "'";
    } 
    if(params.userName){
        query+= " AND username = "+"'" + params.userName + "'";
    }
    if(params.firstName){
        query+= " AND first_name LIKE '%"+params.firstName+"%'";
    } 
    query+= " LIMIT "+ params.limit +" OFFSET "+ params.offset
    return new Promise((resolve, reject) => {
        connection.query(query,(err, result)=> {
            if(err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

let findById=(id)=>{
    let query = "SELECT * FROM users WHERE id= "+id;
    return new Promise((resolve, reject) => {
        connection.query(query,(err, result)=> {
            if(err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

let insertUser = (user) => {
    let query = 
    "INSERT INTO users (username,email,password) VALUES "
     + "('" + user.userName + "','" +user.email+ "','" +user.password+ "');";

     return new Promise((resolve, reject) => {
        connection.query(query,(err, result)=> {
            if(err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

let updateUserById = (user, userId)  => {
    let query = `
        UPDATE users
        SET username = '${user.userName}',
            email = '${user.email}',
            password = '${user.password}'
        WHERE id = ${userId}
    `

    return new Promise((resolve, reject) => {
        connection.query(query,(err, result)=> {
            if(err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}


let deleteUserById =  (userId) => {
    let  query = "DELETE FROM users WHERE id = " + userId  ;
    return new Promise((resolve, reject) => {
        connection.query(query,(err, result)=> {
            if(err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}

module.exports = { getUsers , findAllUsers, findById, insertUser, updateUserById , deleteUserById }