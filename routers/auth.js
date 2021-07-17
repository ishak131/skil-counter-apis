const jwt = require('jsonwebtoken');
const User = require('../schemas/user')
const express = require('express')
const authRouter = express.Router();

async function authinticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('=')[1]
    console.log(authHeader);
    if (!token)
        return res.send(401)
    jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, async (err, user) => {
        if (err)
            return res.send(err)
        const userFroMongoDb = await User.findOne({ email: user.email })
        if (token !== userFroMongoDb.token)
            return res.send(401)
        req.user = userFroMongoDb
        next()
    })
}


authRouter.post('/auth', authinticate, async (req, res) => {
    const userFroMongoDb = req.user
    jwt.verify(userFroMongoDb.token, process.env.TOKEN_PRIVATE_KEY, (err, user) => {
        if (err)
            return res.send(err)
        const timestamp = user.iat
        const timestampAfterOneMonth = timestamp + 2592000
        const TOKEN_END_TIME_IN_BD = new Date(timestampAfterOneMonth * 1000);
        if (TOKEN_END_TIME_IN_BD < new Date()) {
            const { fullName, email } = userFroMongoDb
            res.send('token is expired').sendStatus(401)
            const token = jwt.sign({ fullName, email }, process.env.TOKEN_PRIVATE_KEY);
            userFroMongoDb.updateOne({
                token
            })
        }
        return res.send('token is good')
    })

})



module.exports = { authinticate, authRouter }