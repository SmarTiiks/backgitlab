const mongoose = require('mongoose');
const contactSchema = mongoose.Schema({
    sujet : {type : String},
    sous_titre : {type : String},
    auteur : {type : String},
    description : {type : String},
    image: {type: String},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', contactSchema);