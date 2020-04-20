const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['youtube', 'file', 'site'],
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    discipline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

LessonSchema.plugin(mongoosePaginate);

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;