import {model, Schema} from 'mongoose';

const listSchema = new Schema({
    listName: {
        type: String,
        required: true
    },
    skills: {
        type: [{
            type: ObjectId,
            ref: 'Skill',
        }],
        default: []
    }
})


export default model('ListModel', listSchema)