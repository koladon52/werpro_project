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
    res.render("/");  
});

router.get('/projects/checkjob' , function(req, res , next){
    Jobdetail.find({},function(err , job){
        if(err){
            console.log(err)
        } else {
            res.render("admin/checkjob",{job : job});  
        }
    })

})

router.get('/projects/checkresume' , function(req, res , next){
    Resume.find({},function(err, resume){
        if(err){
            console.log(err);
        } else {
            res.render('admin/checkresume' , {resume : resume})
        }
    })
})

router.get('/projects/checkjob/:id' , function(req, res , next){
    Jobdetail.findById(req.params.id,function(err , job){
        if(err){
            console.log(err)
        } else {
            res.render("admin/adminjobdetail",{job : job});  
        }
    })

})

router.get('/projects/checkresume/:id' , function(req, res , next){
    Resume.findById(req.params.id,function(err, resume){
        if(err){
            console.log(err);
        } else {
            res.render('admin/adminresumedetail' , {resume : resume})
        }
    })
})

router.delete('/projects/checkjob/:id' , function(req, res , next){
    
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
                console.log(foundjob.user.id)
                console.log()
                founduser.jobs.pull(foundjob);
                founduser.save();
                console.log("remove job id from user")
            })
            User.find({favouritejob : foundjob}, function(err , currentuser){
                if(err){
                    console.log(err)
                } else {
                console.log(currentuser)
                for(let j = 0 ; j < currentuser.length ; j++){
                    for(let k = 0 ; k < currentuser[j].favouritejob.length ; k++){
                        if(currentuser[j].favouritejob[k].equals(foundjob)){
                            currentuser[j].favouritejob.pull(foundjob);
                            currentuser[j].save();
                            console.log('removed from your favourite resume');
                        }
                    }
                
                 }
                }
            })
        }
        console.log("deleted complete")
    })
    Jobdetail.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/admin/projects/checkjob');
        }
    });
});



router.delete('/projects/checkresume/:id' , function(req, res , next){

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
            User.findById(foundresume.user._id , function(err, founduser){
                founduser.resumes.pull(foundresume);
                founduser.save();
                console.log("remove resume id from user")
            })
            User.find({favouritejob : foundresume}, function(err , currentuser){
                if(err){
                    console.log(err)
                } else {
                console.log(currentuser)
                for(let j = 0 ; j < currentuser.length ; j++){
                    for(let k = 0 ; k < currentuser[j].favouritejob.length ; k++){
                        if(currentuser[j].favouritejob[k].equals(foundresume)){
                            currentuser[j].favouritejob.pull(foundresume);
                            currentuser[j].save();
                            console.log('removed from your favourite resume');
                        }
                    }
                
                 }
                }
            })
            console.log("deleted complete")
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

module.exports = router;