const express= require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
dotenv.config();
const port = process.env.PORT || 2000;
console.log(port);
const dbService = require('./dbService');
const db = new DbService();

app.use(express.json());
app.use(express.static("client"));
app.use(cookieParser);
app.set("trust proxy", 1);






app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})
