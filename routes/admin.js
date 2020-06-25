var express  =  require('express'),
    router    = express.Router(),
    fs = require('fs'),
    User = require('../models/user'),
    Resume = require('../models/resume'),
    Jobdetail = require('../models/jobdetail'),
    middleware = require('../middleware')
    mongoose = require("mongoose"),
    
    

router.get('/projects' , function(req, res , next){
    res.render("/");  
});

router.get('/projects/checkjob', middleware.isloggedIn , middleware.stateAdmin , function(req, res , next){
    Jobdetail.find({},function(err , job){
        if(err){
            console.log(err)
        } else {
            res.render("admin/checkjob",{job : job});  
        }
    })

})

router.get('/projects/checkresume', middleware.isloggedIn , middleware.stateAdmin , function(req, res , next){
    Resume.find({},function(err, resume){
        if(err){
            console.log(err);
        } else {
            res.render('admin/checkresume' , {resume : resume})
        }
    })
})

router.get('/projects/checkjob/:id', middleware.isloggedIn , middleware.stateAdmin , function(req, res , next){
    Jobdetail.findById(req.params.id,function(err , job){
        if(err){
            console.log(err)
        } else {
            res.render("admin/adminjobdetail",{job : job});  
        }
    })

})

router.get('/projects/checkresume/:id', middleware.isloggedIn , middleware.stateAdmin , function(req, res , next){
    Resume.findById(req.params.id,function(err, resume){
        if(err){
            console.log(err);
        } else {
            res.render('admin/adminresumedetail' , {resume : resume})
        }
    })
})

router.delete('/projects/checkjob/:id' , middleware.isloggedIn, middleware.stateAdmin , function(req, res , next){
    
    Jobdetail.findById(req.params.id, function(err, foundjob){
        if(err){
            console.log(err)
        } else {
            const jobfilepath  = './public/jobapplication/' + foundjob.file;
            fs.unlink(jobfilepath , function(err){
                if(err){
                    console.log(err);
                }
            })
            const jobimagepath  = './public/jobimage/' + foundjob.image;
            fs.unlink(jobimagepath , function(err){
                if(err){
                    console.log(err);
                }
            })
            User.findById(foundjob.user.id, function(err, founduser){
                founduser.jobs.pull(foundjob);
                founduser.save();
                console.log("remove job id from user")
            })
            console.log(foundjob._id)
            console.log(foundjob)
            User.find({favouritejob : foundjob._id}, function(err , userFav){
                if(err){
                    console.log(err)
                } else {
                    // console.log(userFav);
                for(let j = 0 ; j < userFav.length ; j++){
                    for(let k = 0 ; k < userFav[j].favouritejob.length ; k++){
                        if(userFav[j].favouritejob[k].equals(foundjob._id)){
                            console.log(userFav[j].favouritejob[k])
                            userFav[j].favouritejob.pull(foundjob._id);
                            userFav[j].save();
                            console.log('removed from your favourite resume');
                        }
                    }
                
                 }
                }
            })
        }
    })
    Jobdetail.findByIdAndRemove(req.params.id , function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/admin/projects/checkjob');
        }
    });
});



router.delete('/projects/checkresume/:id' , middleware.isloggedIn , middleware.stateAdmin , function(req, res , next){

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
            User.findById(foundresume.user.id , function(err, founduser){
                founduser.resumes.pull(foundresume);
                founduser.save();
                console.log("remove resume id from user")
            })
            User.find({favouriteresume : foundresume._id}, function(err , currentuser){
                if(err){
                    console.log(err)
                } else {
                console.log(currentuser)

                for(let j = 0 ; j < currentuser.length ; j++){
                    for(let k = 0 ; k < currentuser[j].favouriteresume.length ; k++){
                        if(currentuser[j].favouriteresume[k].equals(foundresume._id)){
                            currentuser[j].favouriteresume.pull(foundresume._id);
                            currentuser[j].save();
                            console.log('removed from your favourite resume');
                        }
                    }
                
                 }
                }
            })
        }
        
    })

    Resume.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/admin/projects/checkresume');
        }
    });
})

router.get('/logout',middleware.isloggedIn ,function(req, res){
    req.logout();
    req.flash('success','Logout Successfully!');
    res.redirect('/');
});

module.exports = router;