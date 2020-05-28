const express = require("express"),
      path = require("path"),
      bodyParser =  require("body-parser"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      flash = require('connect-flash'),
      passportlocal = require('passport-local'),
      passportlocalMongoose = require('passport-local-mongoose'),
      methodOverride = require('method-override'),
      User = require('./models/user'),
      Resume = require('./models/resume'),
      middleware = require('./middleware');

      ;
let app = express();

mongoose.connect('mongodb://localhost:27017/projectweb');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));

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

//.....................WORKER.................

app.get("/resume", middleware.isloggedIn,function(req, res){
    res.render("findjob/resume");
})

multer  = require('multer')
var resume = multer.diskStorage({
    destination : function(req,gile,cb){
        cb(null,'./public/resume/');
    },
    filename : function(req,gile,cb){
        cb(null,Date.now()+".pdf");
    },
})

upload = multer({ storage : resume})

app.post("/resume",upload.single("pdf"), middleware.isloggedIn,function(req, res){
        let user           = {
            id : req.user._id,
            username : req.user.username
        }
        let username       = req.body.username;
        let firstname      = req.body.firstname;
        let lastname       = req.body.lastname;
        let description    = req.body.desc;
        let file           = req.body.file;
        let employmenttype = req.body.employmenttype;
        let jobtype        = req.body.jobtype;
        let date           = req.body.date;
        let time           = req.body.time;
        let resume = {user : user,firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:time,description:description,file:file,date:date};
        // if(req.file){
        //     var profileimage = req.file.filename;
        // } else {
        //     var profileimage = "No File";
        //     } 
        Resume.create(resume, function(err,newResume){
        if(err){
            console.log(err); 
        } else {
            User.findOne({username : username},function(err, foundUser){
                if(err){
                    console.log(err);
                } else {
                    foundUser.resumes.push(newResume);
                    foundUser.save(function(err, data){
                        if(err){
                            console.log(err)
                        } else {
                            console.log(data);
                            res.redirect("/");
                        }
                    })
                }
            })
            
        }
    });
})

app.get("/My_resume",middleware.isloggedIn,function(req, res){
    Resume.find({} ,function(error, myResume){
        if(error){
            console.log(error);
        } else
        {
            res.render("findjob/My_resume",{Resume:myResume});
        }
    })
});


app.get("/My_resume/:id",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log("Error");
        } else {
            res.render("findjob/My_resumedetail",{resume:idResume});
        }
    });
});

app.put("/My_resume/:id/edit",middleware.isloggedIn ,function(req,res){
    Resume.findByIdAndUpdate(req.params.id, req.body.resume, function(err, updated){
        if(err){
            res.redirect('/');
        } else {
            res.redirect('/My_resume/' + req.params.id);
        }
    })
})

app.get("/My_resume/:id/edit",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log("Error");
        } else {
            res.render("findjob/editResume",{resume:idResume});
        }
    });
})

app.delete("/My_resume/:id/edit",middleware.isloggedIn, function(req,res){
    Resume.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/My_resume');
        } else {
            res.redirect('/My_resume');
        }
    });
})

app.get("/Liked", middleware.isloggedIn, function(req, res){
    res.render("Liked");
})

app.get("/findjoblist", middleware.isloggedIn,function(req, res){
    res.render("findjob/findjoblist");
})




//.....................OPERATOR.................

app.get("/workerlist",middleware.isloggedIn,function(req, res){
    Resume.find({},function(error, allResume){
        if(error){
            console.log('Error!');
        } else
        {
            res.render("findworker/findworkerlist",{Resume:allResume});
        }
    })
});

app.get("/workerlist/:id",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/workdetail",{resume:idResume});
        }
    });
})

app.get("/Liked", middleware.isloggedIn, function(req, res){
    res.render("Liked");
})

//................profile..............

multer  = require('multer')
var storage = multer.diskStorage({
    destination : function(req,gile,cb){
        cb(null,'./public/images/');
    },
    filename : function(req,gile,cb){
        cb(null,Date.now()+".jpg");
    },
})

upload = multer({ storage : storage})

app.get("/profile",middleware.isloggedIn,function(req, res){
    res.render("Autherization/profile");
})

app.get("/profile/edit",middleware.isloggedIn,function(req, res){
    res.render("Autherization/editprofile");
})

app.post("/profile/edit" ,upload.single("img") ,middleware.isloggedIn, function(req,res){
    let id = req.body.id;
    if(req.file){
        var profileimage = req.file.filename;
    } else {
        var profileimage = "No Image";
        }    
        User.update({_id:id},{$set:{firstname : req.body.firstname,lastname : req.body.lastname,phone : req.body.phone, address : req.body.address, img : profileimage}}, function(error,profile){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/profile");
        }
    });
});
//..............middleware...........


// ---------Authen--------------

app.get('/login', function(req, res){
    res.render('Autherization/login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash : true,
    failureFlash : true,
    successFlash : "Welcome to FindJob",
    failureFlash : "Invalid username or password"
}),function(req, res){
});


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
            req.flash('success','Welcome to FindJob' + user.username);
            res.redirect('/');
        });
    });
});

app.get('/logout',middleware.isloggedIn ,function(req, res){
    req.logout();
    req.flash('success','Logout Successfully!');
    res.redirect('/');
});

app.listen(3000, function(res,req){
    console.log("SERVER STARTED")
})
