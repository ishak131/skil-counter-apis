const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    skillName: {
        type: String,
        required: true
    },
    skillScore: {
        type: Number,
        required: true,
        default: 0,
    },
})

module.exports = mongoose.model('Skill', skillSchema)

