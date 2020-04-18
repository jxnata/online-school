const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        unique: true,
        required: true,
    },
    image: {
        type: String,
        default: 'https://escolaonline.s3.amazonaws.com/default.png'
    },
    discipline: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
    }],
    class: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    mobile_phone: {
        type: String,
        required: true,
    },
    player_id: {
        type: String,
    },
    type: {
        type: String,
        default: 'teacher'
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    password_reset_token: {
        type: String,
    },
    password_reset_expires: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

TeacherSchema.plugin(mongoosePaginate);

TeacherSchema.pre('save', async function(next){
    if (this.password !== undefined) {
        const hash = await bcrypt.hashSync(this.password, 7);
        this.password = hash;
    }
    next();
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;