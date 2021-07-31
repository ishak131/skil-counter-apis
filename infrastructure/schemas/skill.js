import {model, Schema} from 'mongoose';

const skillSchema = Schema({
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

export default model('SkillModel', skillSchema)
