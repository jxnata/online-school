const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

TeamSchema.plugin(mongoosePaginate);

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;