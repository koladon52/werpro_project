const express = require("express"),
      path = require("path"),
      bodyParser =  require("body-parser"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      passportlocal = require('passport-local');
      passportlocalMongoose = require('passport-local-mongoose')
      User = require('./models/user') 
      ;

let app = express();

mongoose.connect('mongodb://localhost:27017/projectweb');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('express-session')({
    secret: 'CSS227',
    resave: false,
    saveIninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("landing");
})

app.get("/Find_a_job", isloggedIn, function(req, res){
    res.render("Find_a_job");
})

app.get("/History",isloggedIn, function(req, res){
    res.render("History");
})

app.get("/Liked",isloggedIn, function(req, res){
    res.render("Liked");
})

app.get("/profile",isloggedIn,function(req, res){
    res.render("Autherization/profile");
})

app.get("/profile/editprofile",isloggedIn,function(req, res){
    res.render("Autherization/editprofile");
})

app.get("/resume",isloggedIn,function(req, res){
    res.render("findjob/resume");
})

// ---------Authen--------------

app.get('/login', function(req, res){
    res.render('Autherization/login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}),function(req, res){
});

function isloggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.get('/signup', function(req, res){
    res.render('Autherization/signup');
});

app.post('/signup', function(req, res){
    User.register(new User({username: req.body.username, email: req.body.email, type: req.body.Type}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('Autherization/signup');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/');
        });
    });
});

app.get('/logout',isloggedIn ,function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(3000, function(res,req){
    console.log("SERVER STARTED")
})
