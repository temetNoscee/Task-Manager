const session = require("express-session");
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const pool = mysql.createPool({
    host:process.env.HOST, 
    user: process.env.user, 
    database: process.env.DATABASE, 
    password: process.env.PASSWORD});
const promisePool = pool.promise();

pool.getConnection((err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Connected');
})


class DbService{
    async createAccount(data){
        try{
            const query = "INSERT INTO account (username,email,password) VALUES (?,?,?)";
            const [rows, fields] = await promisePool.query(query, [data.username, data.email, data.password]);
            console.log('Account created.');
            return rows;
        }catch(err){
            return err;
        }
        
    }

    async createSession(sessionId, username){
        try{
            const query = "INSERT INTO session(session_id, username) VALUES (?,?)"
            const [rows, fields] = await promisePool.query(query, [sessionId, username]);
            console.log("Session created.");
            return rows;
        }catch(err){
            console.log(err);
        }
    }

    async clearSession (sessionId){
        try{
            const query = "DELETE FROM session WHERE session_id = ?";
            const [rows,fields] = await promisePool.query(query,[sessionId]);
            console.log("Session ended successfully.");
            return {sessionId : rows.session_id};    
        }catch(err){
            console.log(err);
        }
    }

    async login(data){
        try{
            const query = "SELECT * FROM account WHERE email=? AND password=?";
            const [rows,fields] = await promisePool.query(query, [data.email, data.password]);
            return rows;
        }catch(err){
            console.log(err);
        }
    }

    async checkLogin(sessionId){
        try{
            const query = "SELECT * FROM session WHERE session_id=?";
            const [rows,fields] = await promisePool.query(query, [sessionId]);
            console.log(rows);
            return rows[0];
        }catch(err){
            console.log(err);
        }
    }
    
    async checkSession(data){
        try{
            const query = "SELECT * FROM session WHERE session_id=? AND username = ?";
            const [rows, fields] = await promisePool.query(query, [data.session_id, data.user]);
            console.log("Row:",rows[0])
            return {session_id : rows[0].session_id,
                    username: rows[0].username
                };
        }catch(err){
            console.log(err);
        }
        
        
    }

    async createTask(data){
        try{
            const query = "INSERT INTO tasks(username,task) VALUES (?,?)";
            await promisePool.query(query,[data.user, data.task]);
        }catch(err){
            return err;
        }

    }

    async getTasks(data){
        try{
            const query = "SELECT * FROM tasks WHERE username=?";
            const [rows, fields] = await promisePool.query(query, [data.user]);
            console.log(rows);
            return rows;
        }catch(err){
            return err;
        }
    }

    async deleteTask(data){
        try{
            const query = "DELETE FROM tasks WHERE task_id = ?";
            await promisePool.query(query,[data.taskId]);
        }catch(err){
            console.log(err);
        }
        
    }

        async updateTask(data){
            const query = "UPDATE tasks SET task = ? WHERE task_id = ?"
            await promisePool.query(query,[data.newTask, data.taskId]);
            return;
        }

}


module.exports = DbService;