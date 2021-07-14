const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../schemas/user');
const userRouter = express.Router();

////////////////////////  create user account //////////////////////////////

userRouter.post('/createUser', async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        const isFoundUser = await User.findOne({ email });
        if (isFoundUser)
            return res.status(409).send('this user already exists');
        const salt = await bcrypt.genSalt(10)
        const newPassword = await bcrypt.hash(password, salt);
        const token = jwt.sign({ fullName, email }, process.env.TOKEN_PRIVATE_KEY);
        const user = new User({
            fullName, email, password: newPassword, token
        })
        const savedUser = await user.save()
        return res.json({ token: savedUser.token })
    } catch (err) {
        console.log(err);
        return res.json({ message: err })
    }
})

//////////////////////// Log in  //////////////////////////////

userRouter.get('/logIn/:email/:password', async (req, res) => {
    try {
        const { password, email } = req.params
        const loggedInUser = await User.findOne({ email });
        if (!loggedInUser)
            return res.sendStatus(400)
        const passwordFromDB = loggedInUser.password;
        const passwordIsCorrect = await bcrypt.compare(password, passwordFromDB);
        return passwordIsCorrect ? res.json({ token: loggedInUser.token }) : res.sendStatus(400)
    } catch (err) {
        res.send({ message: err })
    }
})


userRouter.get('/', authinticate, async (req, res) => {
    const user = User.findOne({ email: req.user.email })
    if (user)
        return res.send(user)
    res.send(404)
})


function authinticate(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('=')[1]
    if (!token)
        return res.send(404)

    jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, user) => {
        if (err)
            return res.send(err)
        res.send(user)
        req.user = user
        next()
    })

}

module.exports = userRouter