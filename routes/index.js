//////////////////ROUTE///////////////////

const express = require('express'),
      router = express.Router();
      passport = require('passport'),
      User = require('../models/user');
      middleware = require('../middleware'),

router.get("/", function(req, res){
        res.render("landing");
    })

router.get('/login', function(req, res){
    res.render('Autherization/login');
});

router.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash : true,
    failureFlash : true,
    successFlash : "Welcome to FindJob",
    failureFlash : "Invalid username or password"
}),function(req, res){
});


router.get('/signup', function(req, res){
    res.render('Autherization/signup');
});

router.post('/signup', function(req, res){
    User.register(new User({username: req.body.username, email: req.body.email, type: req.body.Type}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('Autherization/signup');
        }
        passport.authenticate('local')(req,res,function(){
            req.flash('success','Welcome to FindJob' + user.username);
            res.redirect('/');
        });
    });
});

router.get('/logout',middleware.isloggedIn ,function(req, res){
    req.logout();
    req.flash('success','Logout Successfully!');
    res.redirect('/');
});



module.exports = router;