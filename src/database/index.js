const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_DB}`, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

module.exports = mongoose;