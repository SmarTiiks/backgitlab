const mongoose = require('mongoose');
var schema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    admin: {type: Boolean}
});

module.exports = mongoose.model('User', schema);