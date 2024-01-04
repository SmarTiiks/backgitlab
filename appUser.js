const { createToken } = require('./JWT');
const User = require('./models/User');
const bcrypt = require('bcrypt');

function doAll(app){
    // inscription
    app.post('/api/inscription', function(req, res){
        const Data = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email,
            admin: req.body.admin
        });
        Data.save()
        .then(result => {
            console.log('User saved');
            res.redirect('/connexion');
        }).catch(err => {
            console.log(err);
        });
    });

    app.get('/inscription', function(req, res){
        res.render('inscription');
    });

    // connexion
    app.post('/api/connexion', function(req, res){
        User.findOne({
            username: req.body.username
            // password: req.body.password
        }).then(user => {
            if(user){
                if(bcrypt.compareSync(req.body.password, user.password)){
                    console.log('User found');
                    const accessToken = createToken(user);
                    res.cookie('access-token', accessToken, {
                        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                        httpOnly: true
                    });
                    console.log("cookie created successfully");
                    res.redirect(process.env.FRONTEND_URL + '');
                } else {
                    return res.status(404).send("Invalid password");
                }
            } else {
                return res.status(404).send("User not found with username " + req.body.username);
            }
        }).catch(err => {
            console.log(err);
        });
    });

    app.get('/connexion', function(req, res){
        res.render('connexion');
    });

    // deconnexion
    app.get('/deconnexion', function(req, res){
        res.clearCookie('access-token');
        res.redirect(process.env.FRONTEND_URL + '');
    });
};

exports.doAll = doAll;