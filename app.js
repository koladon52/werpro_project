const express = require("express"),
      path = require("path"),
      bodyParser =  require("body-parser"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      flash = require('connect-flash'),
      passportlocal = require('passport-local'),
      passportlocalMongoose = require('passport-local-mongoose'),
      User = require('./models/user') 
      ;

let app = express();

mongoose.connect('mongodb://localhost:27017/projectweb');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

app.use(require('express-session')({
    secret: 'CSS227',
    resave: false,
    saveIninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("landing");
})

app.get("/findjob", isloggedIn, function(req, res){
    res.render("findjob/findjoblist");
})

app.get("/findworker", isloggedIn, function(req, res){
    res.render("findworker/findworkerlist");
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

app.get("/findjoblist",isloggedIn,function(req, res){
    res.render("findjob/findjoblist");
})

app.get("/findworkerlist",isloggedIn,function(req, res){
    res.render("findworker/findworkerlist");
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
    req.flash('error','Please Login first');
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
            req.flash('success','Welcome to FindJob' + user+username);
            res.redirect('/');
        });
    });
});

app.get('/logout',isloggedIn ,function(req, res){
    req.logout();
    req.flash('success','Logout Successfully!');
    res.redirect('/');
});

app.listen(3000, function(res,req){
    console.log("SERVER STARTED")
})
