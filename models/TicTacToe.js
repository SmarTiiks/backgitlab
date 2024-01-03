const mongoose = require('mongoose');
const contactSchema = mongoose.Schema({
    grid : {
        type: Array,
        default: [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ]
    },

    winner: {
        type: String,
        default: ""
    },
    player1: {
        type: Object,
        default: {
            username: "",
            score: 0
        }
    },
    player2: {
        type: Object,
        default: {
            username: "",
            score: 0
        }
    },
    turn: {
        type: String,
        default: ""
    },
    playersinit: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('TicTacToe', contactSchema);