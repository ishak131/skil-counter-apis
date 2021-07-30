const express = require('express');
const { authinticate } = require('./auth');
const skillRouter = express.Router();
const List = require('../schemas/list');
const Skill = require('../schemas/skill');
const User = require('../schemas/user');

////////////////////////  create user account //////////////////////////////

skillRouter.post('/createNewSkill', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { skillName, listId } = req.body
        const isOwnedByThisUser = user.lists.includes(listId)
        if (!isOwnedByThisUser)
            return res.send(404)
        const skill = new Skill({
            skillName
        })
        const savedSkill = await skill.save()
        if (!savedSkill)
            return res.send(503)
        const list = await List.findByIdAndUpdate({ _id: listId }, { $push: { skills: savedSkill._id } })
        if (!list) {
            return res.send(503)
        }
        return res.send({ list })
    } catch (error) {
        return res.status(400).send({ error })
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////

skillRouter.put('/editSkillScore', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { skillId, listId, skillScore } = req.body
        const isOwnedByThisUser = user.lists.includes(listId)
        if (!isOwnedByThisUser)
            return res.status(404).send('this list is not found in your Lists')
        const getListFromDB = await List.findById({ _id: listId })
        const isOwnedByThisList = getListFromDB.skills.includes(skillId);
        if (!isOwnedByThisList)
            return res.status(404).send('this Skill is not found in this List')
        const skillScoreParsed = parseInt(skillScore);
        if (skillScoreParsed < 0)
            return res.status(400).send('skill score can not be less than 0');
        const skill = await Skill.findByIdAndUpdate({ _id: skillId }, { skillScore: parseInt(skillScore) })
        if (!skill) {
            return res.send(503).send(' somthing went wrong please try again ')
        }
        return res.send({ skill })
    } catch (error) {
        return res.status(400).send({ error })
    }
})

///////////////////////////////////////////////////////////////////////////////

skillRouter.delete('/deleteSkill/:skillId/:listId', authinticate, async (req, res) => {

    try {
        const { user } = req
        const { skillId, listId } = req.params
        const isOwnedByThisUser = user.lists.includes(listId)
        if (!isOwnedByThisUser)
            return res.status(404).send('this skill is not found')
        const isFoundList = await List.findByIdAndUpdate({ _id: listId }, { "$pull": { skills: skillId } })
        if (!isFoundList)
            return res.status(404).send('this list is not found');
        const isFoundSkill = await Skill.findByIdAndRemove({ _id: skillId })
        if (!isFoundSkill)
            return res.status(404).send('this skill is not found');
        return res.send('skill is removed successfully')
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
        const { lists } = getUserDataFromDB;
        const arrayOfLists = []
        const listsLength = lists.length;
        await lists.map(async (listId, listIndex) => {
            const listData = await List.findById({ _id: listId })
            const { listName, skills } = listData
            const skillLength = skills.length;
            const arrayOfSkills = []
            await skills.map(async (skillId, skillIndex) => {
                const skillData = await Skill.findById({ _id: skillId });
                const { skillName, skillScore } = skillData;
                arrayOfSkills.push({ skillName, skillScore, skillId })
                if (listIndex === listsLength - 1 && skillIndex === skillLength - 1)
                    return res.send({ arrayOfLists })
            })
            arrayOfLists.push({ listId, listName, skills: arrayOfSkills })
        })
        return
    } catch (error) {
        return res.status(400).send({ error })
    }
})

module.exports = skillRouter