const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');

const SchoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
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
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        select: false,
        required: true
    },
    mobile_phone:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
    },
    address:{
        type: String,
        required: true,
    },
    number:{
        type: String,
        required: true,
    },
    district:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    zipcode:{
        type: String,
        required: true,
    },
    player_id:{
        type: String,
    },
    type: {
        type: String,
        default: 'school'
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
    created_at:{
        type: Date,
        default: Date.now,
    },
});

SchoolSchema.plugin(mongoosePaginate);

SchoolSchema.pre('save', async function(next){
    if (this.password !== undefined) {
        const hash = await bcrypt.hashSync(this.password, 7);
        this.password = hash;
    }
    next();
});

const School = mongoose.model('School', SchoolSchema);

module.exports = School;