const mongoose = require('mongoose');


const listSchema = mongoose.Schema({
    listName: {
        type: String,
        required: true
    },
    skills: {
        type: [{
            type: mongoose.ObjectId,
            ref: 'Skill',
        }],
        default: []
    }
})


module.exports = mongoose.model('List', listSchema)