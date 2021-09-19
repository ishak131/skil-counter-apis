const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/user');
const listRouter = require('./routers/list');
const skillRouter = require('./routers/skill');
const { authRouter } = require('./routers/auth');
const cors = require('cors');
const uploadRouter = require('./routers/image');
require('dotenv/config')

///////////////////////////// mongodb+srv://skill-counter-api:<password>@cluster0.figsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const path = require('path');
//const cookieParser = require('cookie-parser');
//const logger = require('morgan');
/////////// pass vGKXKGcd78iOcYjm

const app = express()

//////////////// app used dependencies

app.use(express.json())
app.use(cors())

/////////////////////////////////
app.use('/static', express.static(path.join(__dirname, 'public')))
//app.use('/static', express.static('public'))
////////////////////////////////
app.use("/user", userRouter)
app.use("/list", listRouter)
app.use("/skill", skillRouter)
app.use("/upload", uploadRouter)
app.use("/", authRouter)
/////////////////////////////////////////////////

app.get('/', (req, res) => res.send('yes aim working on host 4000'))


/////////////////// conecting database with apis 
mongoose.connect(
    process.env.DB_CONECTION,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
    () => console.log("db is conected")
);



app.listen(process.env.PORT || 4000)