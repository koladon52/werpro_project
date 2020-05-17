const express = require("express"),
      path = require("path"),
      bodyParser =  require("body-parser"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      flash = require('connect-flash'),
      passportlocal = require('passport-local'),
      passportlocalMongoose = require('passport-local-mongoose'),
      User = require('./models/user'),
      Resume = require('./models/resume')

      ;
//test
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

//.....................WORKER.................

app.get("/resume", isloggedIn,function(req, res){
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

app.post("/resume",upload.single("pdf"), isloggedIn,function(req, res){
        let username       = req.body.username;
        let firstname      = req.body.firstname;
        let lastname       = req.body.lastname;
        let description    = req.body.desc;
        let file           = req.body.file;
        let employmenttype = req.body.employmenttype;
        let jobtype        = req.body.jobtype;
        let date           = req.body.date;
        let time           = req.body.time;
        let resume = {username:username,firstname:firstname,lastname:lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:time,description:description,file:file,date:date};
        console.log(resume);
        if(req.file){
            var profileimage = req.file.filename;
        } else {
            var profileimage = "No Image";
            } 
        Resume.create(resume, function(error,newResume){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/");
        }
    });
})

// app.post("/resume", isLoggedIn, function(req,res){
//     let n_name = req.body.name;
//     let n_image = req.body.image;
//     let n_desc = req.body.desc;
//     let n_card = {name:n_name,image:n_image,desc:n_desc};
//     resume.create(n_card, function(error,newCard){
//         if(error){
//             console.log("error"); 
//         } else {
//             console.log("New card added.");
//             res.redirect("../tarot/list");
//         }
//     });
// });


app.get("/Liked", isloggedIn, function(req, res){
    res.render("Liked");
})

app.get("/findjoblist", isloggedIn,function(req, res){
    res.render("findjob/findjoblist");
})


//.....................OPERATOR.................

app.get("/workerlist",isloggedIn,function(req, res){
    Resume.find({},function(error, allResume){
        if(error){
            console.log('Error!');
        } else
        {
            res.render("findworker/findworkerlist",{Resume:allResume});
        }
    })
});

app.get("/workerlist/:id",isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/workdetail",{resume:idResume});
        }
    });
})

app.get("/Liked", isloggedIn, function(req, res){
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

app.get("/profile",isloggedIn,function(req, res){
    res.render("Autherization/profile");
})

app.get("/profile/edit",isloggedIn,function(req, res){
    res.render("Autherization/editprofile");
})

app.post("/profile/edit" ,upload.single("img") ,isloggedIn, function(req,res){
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


function isloggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','Please Login first');
    res.redirect('/login');
}

// function stateOperator(req, res, next){
//     if(User.type === "operator"){
//         return next();
//     }
//     req.flash('error','You are logged as Worker');
// }

// function stateWorker(req, res, next){
//     if(User.type === "worker"){
//         return next();
//     }
//     req.flash('error','You are logged as Operator'); 
// }

// ---------Authen--------------

app.get('/login', function(req, res){
    res.render('Autherization/login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
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

app.get('/logout',isloggedIn ,function(req, res){
    req.logout();
    req.flash('success','Logout Successfully!');
    res.redirect('/');
});


// app.post("/resume", isLoggedIn, function(req,res){
//     let n_name = req.body.name;
//     let n_image = req.body.image;
//     let n_desc = req.body.desc;
//     let n_card = {name:n_name,image:n_image,desc:n_desc};
//     resume.create(n_card, function(error,newCard){
//         if(error){
//             console.log("error"); 
//         } else {
//             console.log("New card added.");
//             res.redirect("../tarot/list");
//         }
//     });
// });

app.listen(3000, function(res,req){
    console.log("SERVER STARTED")
})
