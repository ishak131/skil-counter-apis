const jwt = require('jsonwebtoken');
const User = require('../infrastructure/schemas/user')
const express = require('express')
const authRouter = express.Router();

async function authinticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split('=')[1]
        if (!token)
            return res.send(401)
        jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, async (err, user) => {
            if (err)
                return res.status(400).send({ err });
            const userFroMongoDb = await User.findOne({ email: user.email })
            if (token !== userFroMongoDb.token)
                return res.send(401)
            req.user = userFroMongoDb
            next()
        })
    } catch (error) {
        res.status(400).send({ error })
    }
}


authRouter.post('/auth', authinticate, async (req, res) => {
    try {
        const userFroMongoDb = req.user
        console.log(userFroMongoDb);
        jwt.verify(userFroMongoDb.token, process.env.TOKEN_PRIVATE_KEY, async (err, user) => {
            if (err)
                return res.status(400).send(err)
            const timestamp = user.iat
            const timestampAfterOneMonth = timestamp + 2592000
            const TOKEN_END_TIME_IN_BD = new Date(timestampAfterOneMonth * 1000);
            if (TOKEN_END_TIME_IN_BD < new Date()) {
                const { fullName, email } = userFroMongoDb
                const token = jwt.sign({ fullName, email }, process.env.TOKEN_PRIVATE_KEY);
                await userFroMongoDb.updateOne({
                    token
                })
                return res.send('token is expired').sendStatus(401)
            }
            return res.send('token is good')
        })
    } catch (err) {
        return res.status(400).send({ error: err })
    }
})



module.exports = { authinticate, authRouter }