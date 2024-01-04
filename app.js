var express = require('express');
var app = express();
var path = require('path');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');

// Multer
const multer = require('multer');
app.use(express.static('uploads'));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req,file,cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage});

// method put et delete pour express
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}));

// cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// JWT
const {createToken, validateToken} = require('./JWT');

// JWT-decode
const {jwtDecode} = require('jwt-decode');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connexion mongodb
var mongoose = require('mongoose');
const url = process.env.DATABASE_URL

mongoose.connect(url)
.then(console.log("MongoDB connected"))
.catch(err => console.log(err));

app.set('view engine', 'ejs');

// Models:
var Contact = require('./models/Contacts');
var Post = require('./models/Post');
var TicTacToe = require('./models/TicTacToe');



app.get('/', function(req, res) {
    // res.sendFile(__dirname + '/index.html');
    // res.sendFile(path.resolve('index.html'));
    Contact.find().then(dataset => {
        // console.log(data);
        // res.render("Home", {dataEjs: dataset});
        res.json(dataset);
    }).catch(err => {
        console.log(err);
    });


});

app.post('/uploadimage', upload.single('image'), function(req, res) {
    if(!req.file) {
        res.status(400).send("No file uploaded");
    }
    else{
    res.json("File uploaded");
    }
});

app.post('/uploadmultipleimages', upload.array('image', 5), function(req, res) {
    if(!req.files) {
        res.status(400).send("No file uploaded");
    }
    else{
    res.json("File uploaded");
    }
});

app.get('/blogs', function(req, res) {
    Post.find().then(dataset => {
        res.json(dataset);
    }).catch(err => {
        console.log(err);
    });
});

app.get('/getJwt', validateToken, function(req, res) {
    const decoded = jwtDecode(req.cookies["access-token"]);
    log(decoded);
    res.json(decoded);
});

app.get('/blog/:id', function(req, res) {
    Post.findOne({
        _id: req.params.id}).then(dataset => {
            res.json(dataset);
        }
    ).catch(err => {
        console.log(err);
    });
});

app.get('/blog2', function(req, res) {
    Post.find().then(dataset => {
        // console.log(data);
        res.render("Blog2", {dataEjs: dataset});
    }).catch(err => {
        console.log(err);
    });
});

app.get('/NewContact', validateToken, function(req, res) {
    res.render("NewContact");
});

app.get('/NewPost', function(req, res) {
    res.render("NewPost");
});

app.get('/contact/:id', function(req, res) {
    Contact.findOne({
        _id: req.params.id}).then(dataset => {
            res.render("Edit", {obj: dataset});
        }
    ).catch(err => {
        console.log(err);
    });
});

app.get('/modifPost/:id', function(req, res) {
    Post.findOne({
        _id: req.params.id})
        .then(dataset => {
            res.render("EditPost", {obj: dataset});
        }
    ).catch(err => {
        console.log(err);
    });
});

app.post("/submit-data", function(req, res) {
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var email = req.body.email;
    var message = req.body.message;
    const Data = new Contact({
        nom: nom,
        prenom: prenom,
        email: email,
        message: message
    });
    Data.save()
        .then(item => {
            console.log("item saved to database");
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("unable to save to database");
        });
    // res.send('Bonjour ' + nom + ' ' + prenom + ',<br> Merci de nous avoir contacté.<br> Nous reviendrons vers vous dans les plus brefs délais à cette adresse: ' + email + ' !');
});
app.post("/submit-post", upload.single('image'), function(req, res) {
    var sujet = req.body.sujet;
    // var sout_titre = req.body.sous_titre;
    // var auteur = req.body.auteur;
    var description = req.body.description;
    const Data = new Post({
        sujet: sujet,
        // sous_titre: sout_titre,
        // auteur: auteur,
        description: description,
        image: (req.file.filename),
        date: req.body.date
    });
    if(!req.file) {
        res.status(400).json("No file uploaded");
    }
    else{
        Data.save()
            .then(item => {
                console.log("post saved to database");
                res.json({id: item._id})
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to save to database");
            });
    }
});

app.put("/edit/:id", function(req, res) {
    const Data = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        message: req.body.message
    };
    Contact.updateOne({_id: req.params.id}, {$set: Data})
    .then(dataset => {
        console.log("item updated to database");
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
});

app.put("/editpost/:id", function(req, res) {
    const Data = {
        sujet : req.body.sujet,
        sous_titre : req.body.sous_titre,
        auteur : req.body.auteur,
        description: req.body.description
    };
    Post.updateOne({_id: req.params.id}, {$set: Data})
    .then(dataset => {
        console.log("post updated to database");
        res.redirect(process.env.FRONTEND_URL + 'blogs');
    }).catch(err => {
        console.log(err);
    });
});

app.delete("/delete/:id", function(req, res) {
    Contact.deleteOne({_id: req.params.id})
    .then(dataset => {
        console.log("item deleted from database");
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
});
app.delete("/deletePost/:id", function(req, res) {
    Post.deleteOne({_id: req.params.id})
    .then(dataset => {
        console.log("post deleted from database");
        res.redirect(process.env.FRONTEND_URL + 'blogs');
    }).catch(err => {
        console.log(err);
    });
});

const tstpage = require('./test');
tstpage.tstpage(app);
console.log(tstpage.toto);

// user part
const appUser = require('./appUser');
const { log } = require('console');
appUser.doAll(app);

// TicTacToe part
const TTT = require('./appTTT');
TTT.doAll(app);



var server = app.listen(5000, function(req, res) {
    console.log('Listening on %s on port %d', server.address.address, server.address().port);
});