const express = require('express');
const List = require('../schemas/list');
const { authinticate } = require('./auth');
const listRouter = express.Router();

////////////////////////  create user account //////////////////////////////
listRouter.post('/createNewList', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { listName } = req.body
        const list = new List({
            listName,
            userId: user._id,
        })
        const savedList = await list.save()
        return res.json({ savedList })
    } catch (error) {
        return res.status(400).send({ error })
    }
})


listRouter.delete('/deleteList/:listId', authinticate, async (req, res) => {
    try {
        const { listId } = req.params
        const list = await List.findByIdAndRemove({ _id: listId })
        if (!list)
            return res.status(404).send("Not Found")
        return res.send('deleted successfully')
    } catch (error) {
        return res.status(400).send({ error })
    }
})



listRouter.put('/updateListName', authinticate, async (req, res) => {
    try {
        const { listName, listId } = req.body
        const upatedList = await List.findByIdAndUpdate({ _id: listId }, { listName })
        if (!upatedList)
            return res.send(404)
        return res.json({ upatedList })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})


module.exports = listRouter