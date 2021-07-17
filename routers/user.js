const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../schemas/user');
const { authinticate } = require('./auth');
const userRouter = express.Router();

////////////////////////  create user account //////////////////////////////

userRouter.post('/createUser', async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        const isFoundUser = await User.findOne({ email });
        if (isFoundUser)
            return res.status(409).send({ error: 'This user already exists' });
        const salt = await bcrypt.genSalt(10)
        const newPassword = await bcrypt.hash(password, salt);
        const token = jwt.sign({ fullName, email }, process.env.TOKEN_PRIVATE_KEY);
        const user = await new User({
            fullName, email, password: newPassword, token
        })
        const savedUser = await user.save()
        return res.json({ token: savedUser.token })
    } catch (err) {
        return res.status(400).send({ error: err })
    }
})

//////////////////////// Log in  //////////////////////////////

userRouter.get('/logIn/:email/:password', async (req, res) => {
    try {
        const { password, email } = req.params
        const loggedInUser = await User.findOne({ email });
        if (!loggedInUser)
            return res.status(404).send({ error: 'User name or password is wrong' });
        const passwordFromDB = loggedInUser.password;
        const passwordIsCorrect = await bcrypt.compare(password, passwordFromDB);
        return passwordIsCorrect ?
            res.json({ token: loggedInUser.token }) :
            res.status(404).send({ error: 'User name or password is wrong' });
    } catch (error) {
        res.status(400).send({ error })
    }
})


userRouter.get('/getUser', authinticate, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    if (user)
        return res.send(user)
    res.send(404)
})



module.exports = userRouter