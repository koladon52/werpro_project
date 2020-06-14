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

app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);

// mongoose.connect('mongodb+srv://koladon52:subpadol52@cluster0-euzvy.mongodb.net/webpro',{ useNewUrlParser: true })
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


    var test = multer.diskStorage({
        destination: function (req, file, cb) {
          if (file.mimetype === 'application/pdf') {
            cb(null, './public/resume/')
            
          } else if (file.mimetype === 'image/jpeg') {
            cb(null, './public/resumeimage/')
            
          } else {
            console.log(file.mimetype)
            cb({ error: 'Mime type not supported' })
          }
        },
        filename : function(req, file ,cb){
            if (file.mimetype === 'application/pdf') {
                cb(null,Date.now()+".pdf");
                
              } else if (file.mimetype === 'image/jpeg') {
                cb(null,Date.now()+".jpg");
                
              } else {
                console.log(file.mimetype)
                cb({ error: 'Mime type not supported' })
              }
        },
      })


uploadtest = multer({ storage : test})

app.post("/resume", uploadtest.any() , middleware.isloggedIn,function(req, res){
        
    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;

        let user           = {
            id : req.user._id,
            username : req.user.username,
            img : req.user.img
        }
        console.log(req.files, 'files');
        console.log(req.files);
        console.log
      
        let username       = req.body.username;
        let firstname      = req.body.firstname;
        let lastname       = req.body.lastname;
        let description    = req.body.desc;
        let image          = req.files[0].filename;
        let file           = req.files[1].filename;
        let employmenttype = req.body.employmenttype;
        let jobtype        = req.body.jobtype;
        let workdate       = req.body.date;
        let worktime       = req.body.time;
        let resume = {user : user,firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:worktime,description:description,file:file,date:workdate,editdate : dateTime , image : image};

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

app.put("/My_resume/:id/edit",uploadtest.any(),middleware.isloggedIn ,function(req,res){
    let id = req.params.id;
    let file = req.body.oldfile;
    let image = req.body.oldimage;
    
    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;

    let resumeimage    = image;
    let resumefile     = file;
    let firstname      = req.body.firstname;
    let lastname       = req.body.lastname;
    let description    = req.body.description;
    let employmenttype = req.body.employmenttype;
    let jobtype        = req.body.jobtype;
    let workdate       = req.body.date;
    let worktime       = req.body.worktime;
    console.log(req.files)
    if(req.files[0] && req.files[1]){
        resumeimage = req.files[0].filename;
        resumefile = req.files[1].filename;
        Resume.findById(req.params.id, function(err, foundresume){
            if(err){
                console.log(err)
            } else {
                const imagepath = './public/resumeimage/' + foundresume.image;
                fs.unlink(imagepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                const resumepath = './public/resume/' + foundresume.file;
                fs.unlink(resumepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                
            }
        })
    } 

    if(req.files[0] && req.files[0].fieldname == "file"){
        resumefile = req.files[0].filename;
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
    if(req.files[0] && req.files[0].fieldname == "image"){
        resumeimage = req.files[0].filename;
        Resume.findById(req.params.id, function(err, foundresume){
            if(err){
                console.log(err)
            } else {
                const imagepath = './public/resumeimage/' + foundresume.image;
                fs.unlink(imagepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
    } 

    Resume.findByIdAndUpdate({_id:id},{$set:{firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:worktime,description:description, file : resumefile , image : resumeimage ,date:workdate,editdate : dateTime}},function(err, updated){
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
            console.log(err);
        } else {
                Resume.findById(req.params.id, function(err, foundresume){
                    if(err){
                        console.log(err)
                    } else {
                        const resumepath  = './public/resume/' + foundresume.file;
                        const imagepath  = './public/resumeimage/' + foundresume.image;
                        fs.unlink(resumepath , function(err){
                            if(err){
                                console.log(err);
                            }
                        })
                        fs.unlink(imagepath , function(err){
                            if(err){
                                console.log(err);
                            }
                        })
                    }
                    console.log("deleted complete")
                })
            
            res.redirect('/My_post');
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

app.post('/joblist',middleware.isloggedIn, function(req , res , next){
    var fuzzyfiltercompanyname   = req.body.searchcompanyname;
    var filtersalary             = req.body.searchsalary;
    var filteremploymenttype     = req.body.searchemploymenttype;
    var fileterjobtype           = req.body.searchjobtype;
    
    const filtercompanyname = new RegExp(escapeRegex(fuzzyfiltercompanyname), 'gi');

    // if(filtercompanyname != " " && filtersalary != " " && filteremploymenttype != " "){
    //     var filterParemater = { $and:[{ companyname:filtercompanyname},{$and:[{salary : filtersalary},{employmenttype : filteremploymenttype}]}]}
    // } else if (filtercompanyname != " " && filtersalary == " " && filteremploymenttype != " "){
    //     var filterParemater = { $and:[{ companyname : filtercompanyname},{employmenttype : filteremploymenttype}]}
    // } else if (filtercompanyname == " " && filtersalary != " " && filteremploymenttype != " "){
    //     var filterParemater = { $and:[{ salary : filtersalary},{employmenttype : filteremploymenttype}]}
    // } else {
    //     var filterParemater = {};
    // }

    if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{ companyname : filtercompanyname},{employmenttype : filteremploymenttype}]};
    } else if(filtercompanyname !== '' && filtersalary !== '' && filtyeremploymenttype === ''){
        var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary}]};
    } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === ''){
        var filterParemater={ $and :[{ companyname : filtercompanyname}]};
    } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === ''){
        var filterParemater={ $and :[{ salary : filtersalary}]};
    } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{ employmenttype : filteremploymenttype}]};
    } else {
        var filterParemater = {};
    }

    console.log(filterParemater);

    var jobfilter = Jobdetail.find(filterParemater);
    jobfilter.exec(function(err,data){
        if(err){
            console.log(err);
        } else {
            console.log(data);
            res.render("findjob/joblist",{Job:data});
        }
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


//.....................OPERATOR.................

var applicationfile = multer.diskStorage({
    destination : function(req,gile,cb){
        cb(null,'./public/application_documents/');
    },
    filename : function(req,gile,cb){
        cb(null,Date.now()+".pdf");
    },
})

uploadapplication = multer({ storage : applicationfile})


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
            res.render("findworker/My_postdetail",{job:idjob});
        }
    });
});

app.put("/My_post/:id/edit",uploadapplication.single("file"),middleware.isloggedIn ,function(req,res){

    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;
    
    let id = req.params.id;
    let file = req.body.oldfile;

    let companyname       = req.body.companyname;
    let salary            = req.body.salary;
    let qualti            = req.body.qualti;
    let employmenttype    = req.body.employmenttype;
    let jobtype           = req.body.jobtype;
    let jobpos            = req.body.jobpos;
    let workdate          = req.body.date;
    let worktime          = req.body.time;
    let contact           = req.body.contact;
    let lon               = req.body.lon; 
    let lat               = req.body.lat;
    let country           = req.body.country;
    let district          = req.body.district;
    let postcode          = req.body.postcode;
    let province          = req.body.province;
    let subdistrict       = req.body.subdistrict;
    let aoi               = req.body.aoi;
    let location          = req.body.location

    if(req.file){
        var Applicationfile = req.file.filename;
        Jobdetail.findById(req.params.id, function(err, foundjob){
            if(err){
                console.log(err)
            } else {
                const applicationpath  = './public/application_documents/' + foundjob.file;
                fs.unlink(applicationpath , function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
    } else {
        var Applicationfile = file
    }

    Jobdetail.findByIdAndUpdate({_id:id},{$set:{companyname : companyname,salary : salary,qualti : qualti, employmenttype : employmenttype, jobtype : jobtype , jobpos : jobpos, date : workdate , time : worktime , contact : contact , file : Applicationfile , editdate : dateTime ,lon : lon, lat : lat , location : location , district : district , subdistrint : subdistrict , postcode : postcode , province : province , aoi : aoi , country : country}}, function(error,profile){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/My_post/" + req.params.id);
        }
    });
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
            console.log(err);
        } else {
                Jobdetail.findById(req.params.id, function(err, foundjob){
                    if(err){
                        console.log(err)
                    } else {
                        const applicationpath  = './public/application_documents/' + foundjob.file;
                        fs.unlink(applicationpath , function(err){
                            if(err){
                                console.log(err);
                            }
                        })
                    }
                    console.log("deleted complete")
                })
            
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

app.post("/postjob",uploadapplication.single("file"), middleware.isloggedIn,function(req, res){

    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;

    let user           = {
        id : req.user._id,
        username : req.user.username,
        img : req.user.img
    }

    let Applicationfile   = req.file.filename;
    let username          = req.body.username;
    let companyname       = req.body.companyname;
    let salary            = req.body.salary;
    let qualti            = req.body.qualti;
    let employmenttype    = req.body.employmenttype;
    let jobtype           = req.body.jobtype;
    let jobpos            = req.body.jobpos;
    let workdate          = req.body.date;
    let worktime          = req.body.time;
    let contact           = req.body.contact;
    let location          = req.body.location;
    let lon               = req.body.lon; 
    let lat               = req.body.lat;
    let country           = req.body.country;
    let district          = req.body.district;
    let postcode          = req.body.postcode;
    let province          = req.body.province;
    let subdistrict       = req.body.subdistrict;
    let aoi               = req.body.aoi;
    console.log(country);
    let job = {user : user, companyname : companyname,salary : salary , jobtype:jobtype , employmenttype:employmenttype , worktime : worktime , qualti:qualti , file : Applicationfile , date : workdate ,contact : contact, jobpos : jobpos , editdate : dateTime,
    lon : lon, lat : lat , location : location , district : district , subdistrint : subdistrict , postcode : postcode , province : province , aoi : aoi , country : country};
    
    console.log(job);

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
    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;

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

    
        User.findByIdAndUpdate({_id:id},{$set:{firstname : req.body.firstname,lastname : req.body.lastname,phone : req.body.phone, address : req.body.address, img : profileimage , editdate : dateTime}}, function(error,profile){
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
