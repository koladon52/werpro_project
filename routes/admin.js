var express  =  require('express'),
    router    = express.Router(),
    fs = require('fs'),
    User = require('../models/user'),
    Resume = require('../models/resume'),
    Jobdetail = require('../models/jobdetail'),
    middleware = require('../middleware')
    mongoose = require("mongoose"),
    
    
mongoose.connect('mongodb://localhost:27017/projectweb',{ useNewUrlParser: true })

router.get('/projects' , function(req, res , next){
    res.render("admin/adminproject");
});

module.exports = router;