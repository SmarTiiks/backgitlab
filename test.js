const e = require("express");

function tstpage(app){
    app.get('/test', function(req, res) {
        res.render("test");
    });
}

var toto = 42;

var data = {
    tstpage,
    toto
};
// exports.tstpage = tstpage;
// exports.toto = toto;
module.exports = data;