const express = require("express"),
      path = require("path"),
      bodyParser =  require("body-parser"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      flash = require('connect-flash'),
      passportlocal = require('passport-local'),
      passportlocalMongoose = require('passport-local-mongoose'),
      methodOverride = require('method-override'),
      fs = require('fs'),
      User = require('./models/user'),
      Resume = require('./models/resume'),
      Jobdetail = require('./models/jobdetail'),
      middleware = require('./middleware'),
      multer = require('multer')

      ;
let app = express();

mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);

mongoose.connect('mongodb://localhost:27017/projectweb',{ useNewUrlParser: true })
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

var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();


app.get("/", function(req, res){
    res.render("landing");
})

//.....................WORKER.................

app.get("/findjob", middleware.isloggedIn, function(req, res){
    res.redirect("/login");
})

app.get("/resume", middleware.isloggedIn,function(req, res){
    res.render("findjob/resume");
})

var resumefile = multer.diskStorage({
    destination : function(req,gile,cb){
        cb(null,'./public/resume/');
    },
    filename : function(req,gile,cb){
        cb(null,Date.now()+".pdf");
    },
})

uploadresume = multer({ storage : resumefile})

app.post("/resume",uploadresume.single("file"), middleware.isloggedIn,function(req, res){
        
        today = mm + '/' + dd + '/' + yyyy;
        let user           = {
            id : req.user._id,
            username : req.user.username,
            img : req.user.img
        }
        let username       = req.body.username;
        let firstname      = req.body.firstname;
        let lastname       = req.body.lastname;
        let description    = req.body.desc;
        let file           = req.file.filename;
        let employmenttype = req.body.employmenttype;
        let jobtype        = req.body.jobtype;
        let date           = req.body.date;
        let time           = req.body.time;
        let resume = {user : user,firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:time,description:description,file:file,date:date,editdate : today};

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

app.put("/My_resume/:id/edit",uploadresume.single('file'),middleware.isloggedIn ,function(req,res){
    let id = req.params.id;
    console.log(1);
    today = mm + '/' + dd + '/' + yyyy;
    console.log(2);
    let firstname      = req.body.firstname;
    let lastname       = req.body.lastname;
    let description    = req.body.desc;
    let employmenttype = req.body.employmenttype;
    let jobtype        = req.body.jobtype;
    let date           = req.body.date;
    let time           = req.body.time;
    console.log(3);
    if(req.file){
        var resume = req.file.filename;
        Resume.findById(req.params.id, function(err, foundresume){
            if(err){
                console.log(err)
            } else {
                const resumepath = './public/resume/' + foundresume.file;
                fs.unlink(resumepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
    } 
    console.log(4);
    Resume.findByIdAndUpdate({_id:id},{$set:{firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:time,description:description,file:resume,date:date,editdate : today}},function(err, updated){
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

app.get("/joblist",middleware.isloggedIn,function(req, res){
    Jobdetail.find({},function(error, allJob){
        if(error){
            console.log(error);
        } else
        {
            res.render("findjob/joblist",{Job:allJob});
        }
    })
});

app.get("/joblist/:id",middleware.isloggedIn,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idJob){
        if(error){
            console.log(error);
        } else {
            res.render("findjob/jobdetail",{job:idJob});
        }
    });
})



//.....................OPERATOR.................

app.get("/findworker", middleware.isloggedIn, function(req, res){
    res.redirect("/login");
})

app.get("/My_post",middleware.isloggedIn,function(req, res){
    Jobdetail.find({} ,function(error, myJob){
        if(error){
            console.log(error);
        } else
        {
            res.render("findworker/My_post",{Job:myJob});
        }
    })
});


app.get("/My_post/:id",middleware.isloggedIn,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idjob){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/My_jobdetail",{job:idjob});
        }
    });
});

app.put("/My_post/:id/edit",uploadresume.single("job[file]"),middleware.isloggedIn ,function(req,res){

    Jobdetail.findByIdAndUpdate(req.params.id, req.body.job, function(err, updated){
        if(err){
            res.redirect('/');
        } else {
            res.redirect('/My_post/' + req.params.id);
        }
    })
})

app.get("/My_post/:id/edit",middleware.isloggedIn,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idJob){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/editJob",{job:idJob});
        }
    });
})

app.delete("/My_post/:id/edit",middleware.isloggedIn, function(req,res){
    Jobdetail.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/My_post');
        } else {
            res.redirect('/My_post');
        }
    });
})

app.get("/workerlist",middleware.isloggedIn,function(req, res){
    Resume.find({},function(error, allResume){
        if(error){
            console.log(error);
        } else
        {
            res.render("findworker/findworkerlist",{Resume:allResume});
        }
    })
});

app.get("/workerlist/:id",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log(error);
        } else {
            res.render("findworker/workdetail",{resume:idResume});
        }
    });
})

app.get("/postjob", middleware.isloggedIn, function(req, res){
    res.render("findworker/postjob");
})


app.post("/postjob",uploadresume.single("pdf"), middleware.isloggedIn,function(req, res){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    let user           = {
        id : req.user._id,
        username : req.user.username,
        img : req.user.img
    }
    let username          = req.body.username;
    let companyname       = req.body.companyname;
    let salary            = req.body.salary;
    let qualti            = req.body.qualti;
    let file              = req.body.file;
    let employmenttype    = req.body.employmenttype;
    let jobtype           = req.body.jobtype;
    let jobpos            = req.body.jobpos;
    let date              = req.body.date;
    let time              = req.body.time;
    let contact           = req.body.contact;
    let job = {user : user, companyname : companyname,salary : salary,jobtype:jobtype,employmenttype:employmenttype,worktime:time,qualti:qualti,file:file,date:date,contact : contact, jobpos : jobpos , editdate : today};
    // if(req.file){
    //     var profileimage = req.file.filename;
    // } else {
    //     var profileimage = "No File";
    //     } 
    Jobdetail.create(job, function(err,newJob){
    if(err){
        console.log(err); 
    } else {
        User.findOne({username : username},function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                foundUser.jobs.push(newJob);
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

app.get("/Liked", middleware.isloggedIn, function(req, res){
    res.render("Liked");
})

//................profile..............


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

app.put("/profile/:id/edit" ,upload.single("img") ,middleware.isloggedIn, function(req,res){
    let id = req.body.id;
    let img = req.body.oldimg;
    if(req.file){
        var profileimage = req.file.filename;
        User.findById(req.params.id, function(err, founduser){
            if(err){
                console.log(err)
            } else {
                const imagepath = './public/images/' + founduser.img;
                fs.unlink(imagepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
    } else {
        var profileimage = img;
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
        User.findByIdAndUpdate({_id:id},{$set:{firstname : req.body.firstname,lastname : req.body.lastname,phone : req.body.phone, address : req.body.address, img : profileimage , editdate : today}}, function(error,profile){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/profile");
        }
    });
});


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
