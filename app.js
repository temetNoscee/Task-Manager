const express= require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
dotenv.config();
const port = process.env.PORT || 2000;
console.log(port);
const dbService = require('./DbService');
const db = new dbService();

app.use(express.json());
app.use(express.static("client"));
app.use(cookieParser());

app.set("trust proxy", 1);
app.use(session({ 
    name: "session-id", 
    secret: process.env.SECRET,
    saveUninitialized: true, 
    resave: false, 
    cookie: { secure: true }
})) 

app.use("/tasks", async(req,res,next)=>{
    console.log(req.path);
    const user = req.path.split('/')[1];
    const session_id = req.cookies.session;
    const dbResponse = await db.checkSession({session_id, user})
    //console.log("Artık ol: ", dbResponse.username);
    const dbResponse1 = (typeof dbResponse == "undefined") ? false : dbResponse
    if (!dbResponse1.username) {
        return res.sendFile(path.resolve("./client/routes/permission.html"));
    }
    next();

})
app.get("/", async(req,res)=>{
    const sessionID = req.cookies.session;
    console.log("sessionid:",sessionID)
    const sessionID1 = (typeof value === 'undefined') ? false : value;
    console.log("1:",sessionID1)
    if(sessionID1){
        const dbResponse = await db.checkLogin(sessionID1);
        //console.log("dbResponse:", dbResponse);
        //console.log(typeof dbResponse);

        return res.redirect(`/tasks/${dbResponse.username}`);
    }
    res.sendFile(path.resolve("./client/routes/login.html"))
})

app.get("/tasks/:username", (req,res)=>{
    res.sendFile(path.resolve("./client/routes/homepage.html"));
})


app.get("/logout", (req,res)=>{
    req.session.destroy(async(err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error logging out');
        } else {
            res.clearCookie('session');
            await db.clearSession(req.cookies.session);
            res.json({ message: 'Logout successful' });
        }
    });
})



app.post("/signup", async(req,res)=>{
    const info = req.body;
    const dbResponse = await db.createAccount(info);
    console.log(dbResponse);
    if(dbResponse.message == `Duplicate entry '${info.email}' for key 'account.email_UNIQUE'`){
        return res.status(404).send({ err: "This email address is already registered." });
    }
    if(dbResponse.message == `Duplicate entry '${info.username}' for key 'account.PRIMARY'`){
        return res.status(404).send({ err: "This username is already registered." });
    }
    db.clearSession(req.cookies.session);
    const sessionResponse = await db.createSession(req.sessionID, info.username);
    res.clearCookie("session");
    res.cookie("session", req.sessionID);
    res.json(info);
})

app.post("/login", async(req,res)=>{
    const info  = req.body;
    console.log(info);
    const dbResponse = await db.login(info);
    console.log(dbResponse);
    if(dbResponse.length == 0){
        return res.status(404).send({ err: "Invalid username or password." });
    }
    db.clearSession(req.cookies.session);
    const sessionResponse = await db.createSession(req.sessionID,dbResponse[0].username);
    res.clearCookie("session");
    res.cookie("session", req.sessionID);
    res.json(dbResponse[0]);
})

app.post("/addNewTask", async(req,res)=>{
    // console.log(req);
    const data = req.body;
    console.log("data:",data);
    const dbResponse = await db.createTask(data);
    // console.log("db response:", dbResponse);

    res.json(data);
})

app.post("/showTasks", async(req,res)=>{
    const info = req.body;
    const dbResponse = await db.getTasks(info);
    console.log("db:", dbResponse)
    res.json(dbResponse);
})

app.post("/deleteTask",async(req,res)=> {
    const info = req.body;
    console.log("request",info);
    const dbResponse = await db.deleteTask(info);
    res.json(dbResponse);
})

app.post("/editTask",async(req,res)=>{
    const info = req.body;
    const dbResponse = await db.updateTask(info);
    res.json(dbResponse);
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})
