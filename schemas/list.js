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


//module.exports = mongoose.model('List', listSchema)



const listSchemaUpdated = mongoose.Schema({
    listName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        required: true,
    },
    skills: {
        type: [{
            skillName: {
                type: String,
                required: true
            },
            skillScore: {
                type: Number,
                required: true,
                default: 0,
            },
        }],
        default: []
    }
})


module.exports = mongoose.model('List', listSchemaUpdated)