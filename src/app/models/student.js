const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        unique: true,
        required: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        default: 'https://escolaonline.s3.amazonaws.com/default.png'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
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
    address:{
        type: String,
    },
    number:{
        type: String,
    },
    district:{
        type: String,
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    zipcode:{
        type: String,
    },
    player_id: {
        type: String,
    },
    type: {
        type: String,
        default: 'student'
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

StudentSchema.plugin(mongoosePaginate);

StudentSchema.pre('save', async function(next){
    if (this.password !== undefined) {
        const hash = await bcrypt.hashSync(this.password, 7);
        this.password = hash;
    }
    next();
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;