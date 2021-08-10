const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/user');
const listRouter = require('./routers/list');
const skillRouter = require('./routers/skill');
const { authRouter } = require('./routers/auth');
const cors = require('cors');
const uploadRouter = require('./routers/uploadProfileImage');
require('dotenv/config')

///////////////////////////// mongodb+srv://skill-counter-api:<password>@cluster0.figsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
/////////// pass vGKXKGcd78iOcYjm

const app = express()

//////////////// app used dependencies

app.use(express.json())
app.use(cors())

/////////////////////////////////
/*
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
*/

////////////////////////////////
app.use("/user", userRouter)
app.use("/list", listRouter)
app.use("/skill", skillRouter)
//app.use("/upload", uploadRouter)
app.use("/", authRouter)

/////////////////////////////////////////////////

app.get('/', (req, res) => res.send('yes aim working on host 4000'))


/////////////////// conecting database with apis 
mongoose.connect(
    process.env.DB_CONECTION,
    { useNewUrlParser: true },
    () => console.log("db is conected")
);



app.listen(4000)