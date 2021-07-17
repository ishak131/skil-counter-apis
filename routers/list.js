const express = require('express');
const List = require('../schemas/list');
const { authinticate } = require('./auth');
const listRouter = express.Router();

////////////////////////  create user account //////////////////////////////
listRouter.post('/createNewList', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { lists } = user
        if (lists.length > 2)
            return res.send(402)
        const { listName } = req.body
        const list = new List({
            listName
        })
        const savedList = await list.save()
        await user.updateOne({
            "$push": {
                lists: savedList._id
            }
        })
        return res.send("list is add successfully")
    } catch (err) {
        console.log(err);
        return res.json({ message: err })
    }
})



listRouter.delete('/deleteList', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { listId } = req.body
        const isOwnedByThisUser = user.lists.includes(listId)
        if (!isOwnedByThisUser)
            return res.send(404)
        const list = await List.findByIdAndRemove({ _id: listId })
        if (!list)
            return res.send(404)
        await user.updateOne({
            "$pull": {
                lists: listId
            }
        })
        return res.send('deleted successfully')
    } catch (err) {
        console.log(err);
        return res.json({ message: err })
    }
})



listRouter.put('/updateListName', authinticate, async (req, res) => {
    try {
        const { user } = req
        const { listName, listId } = req.body
        const isOwnedByThisUser = user.lists.includes(listId)
        if (!isOwnedByThisUser)
            return res.send(404)
        const upatedList = await List.findByIdAndUpdate({ _id: listId }, { listName })
        if (!upatedList)
            return res.send(404)
        return res.send({ upatedList })
    }
    catch (err) {
        console.log(err);
        return res.json({ message: err })
    }
})


module.exports = listRouter