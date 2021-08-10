const express = require('express');
const { authinticate } = require('./auth');
const skillRouter = express.Router();
const List = require('../schemas/list');
const Skill = require('../schemas/skill');
const User = require('../schemas/user');

////////////////////////  create user account //////////////////////////////

skillRouter.post('/createNewSkill', authinticate, async (req, res) => {
    try {
        const { skillName, listId } = req.body
        const skill = new Skill({
            skillName
        })
        if (!skill)
            return res.send(503)
        const list = await List.findByIdAndUpdate({ _id: listId }, { $push: { skills: skill } })
        if (!list) {
            return res.send(503)
        }
        return res.send({ skill })
    } catch (error) {
        return res.status(400).send({ error })
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////

skillRouter.put('/editSkillScore', authinticate, async (req, res) => {
    try {
        const { skillId, listId, skillScore } = req.body
        if (!skillId || !listId)
            return res.status(400).send("can't update the skill")
        const skillScoreParsed = parseInt(skillScore);
        if (skillScoreParsed < 0)
            return res.status(400).send('skill score can not be less than 0');
        const skill = await List.updateOne(
            { _id: listId, 'skills._id': skillId },
            { '$set': { 'skills.$.skillScore': skillScoreParsed } }
        )
        return res.send({ skill })
    } catch (error) {
        return res.status(400).send({ error })
    }
})

///////////////////////////////////////////////////////////////////////////////

skillRouter.delete('/deleteSkill/:skillId/:listId', authinticate, async (req, res) => {

    try {
        const { skillId, listId } = req.params
        await List.findByIdAndUpdate(
            { _id: listId },
            { "$pull": { skills: { _id: skillId } } })
        return res.send('The skill is deleted successfully ')
    } catch (error) {
        return res.status(400).send({ error })
    }
})


/////////////////////////////////////////////////////////////////////////////////////
skillRouter.get('/getAllMyLists', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { email } = user
        const getUserDataFromDB = await User.findOne({ email })
        const arrayOfLists = await List.find({ userId: getUserDataFromDB._id })
        return res.json({ arrayOfLists })
    } catch (error) {
        return res.status(400).send({ error })
    }
})

module.exports = skillRouter