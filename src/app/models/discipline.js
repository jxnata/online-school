const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const DisciplineSchema = new mongoose.Schema({
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

DisciplineSchema.plugin(mongoosePaginate);

const Discipline = mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;