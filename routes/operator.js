const express = require('express'),
      router = express.Router();
      fs = require('fs'),
      User = require('../models/user'),
      Resume = require('../models/resume'),
      Jobdetail = require('../models/jobdetail'),
      middleware = require('../middleware'),
      multer = require('multer')
      ;

var jobtest = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'application/pdf') {
        cb(null, './public/jobapplication/')
        
      } else if (file.mimetype === 'image/jpeg') {
        cb(null, './public/jobimage/')
        
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


uploadjob = multer({ storage : jobtest})


router.get("/", middleware.isloggedIn, function(req, res){
    res.redirect("/");
})

router.get("/My_post",middleware.isloggedIn,function(req, res){
    Jobdetail.find({} ,function(error, myJob){
        if(error){
            console.log(error);
        } else
        {
            res.render("findworker/My_post",{Job:myJob});
        }
    })
});


router.get("/My_post/:id",middleware.isloggedIn,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idjob){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/My_postdetail",{job:idjob});
        }
    });
});

router.put("/My_post/:id/edit",uploadjob.any(),middleware.isloggedIn ,function(req,res){

    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;
    
    let id                = req.params.id;
    let file              = req.body.oldfile;
    let image             = req.body.oldimage;
    let jobimage          = image;
    let jobfile           = file;

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

    if(req.files[0] && req.files[1]){
        jobimage = req.files[0].filename;
        jobfile  = req.files[1].filename;
        Jobdetail.findById(req.params.id, function(err, foundjob){
            if(err){
                console.log(err)
            } else {
                const jobimagepath = './public/jobimage/' + foundjob.image;
                fs.unlink(jobimagepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                const jobfilepath = './public/jobapplication/' + foundjob.file;
                fs.unlink(jobfilepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                
            }
        })
    } 

    if(req.files[0] && req.files[0].fieldname == "file"){
        jobfile = req.files[0].filename;
        Jobdetail.findById(req.params.id, function(err, foundjob){
            if(err){
                console.log(err)
            } else {
                const jobfilepath = './public/jobapplication/' + foundjob.file;
                fs.unlink(jobfilepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
    } 
    if(req.files[0] && req.files[0].fieldname == "image"){
        jobimage = req.files[0].filename;
        Jobdetail.findById(req.params.id, function(err, foundjob){
            if(err){
                console.log(err)
            } else {
                const jobimagepath = './public/jobimage/' + foundjob.image;
                fs.unlink(jobimagepath, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        })
    } 

    Jobdetail.findByIdAndUpdate({_id:id},{$set:{companyname : companyname,salary : salary,qualti : qualti, employmenttype : employmenttype, jobtype : jobtype , jobpos : jobpos, date : workdate , time : worktime , contact : contact , file : jobfile , image : jobimage , editdate : dateTime ,lon : lon, lat : lat , location : location , district : district , subdistrint : subdistrict , postcode : postcode , province : province , aoi : aoi , country : country}}, function(error,profile){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/findworker/My_post/" + req.params.id);
        }
    });
})

router.get("/My_post/:id/edit",middleware.isloggedIn,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idJob){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/editJob",{job:idJob});
        }
    });
})

router.delete("/My_post/:id/edit",middleware.isloggedIn, function(req,res){

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
            User.findById(req.user._id, function(err, founduser){
                founduser.jobs.pull(foundjob);
                founduser.save();
                console.log("remove job id from user")
            })
        }
        console.log("deleted complete")
    })

    Jobdetail.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/findworker/My_post');
        }
    });
})

router.get("/workerlist",middleware.isloggedIn,function(req, res){
    Resume.find({},function(error, allResume){
        if(error){
            console.log(error);
        } else
        {
            res.render("findworker/findworkerlist",{Resume:allResume});
        }
    })
});

router.get("/workerlist/:id",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log(error);
        } else {
            res.render("findworker/workdetail",{resume:idResume});
        }
    });
})

router.get("/postjob", middleware.isloggedIn, function(req, res){
    res.render("findworker/postjob");
})

router.post("/postjob",uploadjob.any(), middleware.isloggedIn,function(req, res){

    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time+' '+date;

    let user           = {
        id : req.user._id,
        username : req.user.username,
        img : req.user.img
    }

    let jobfile           = req.files[1].filename;
    let jobimage          = req.files[0].filename;
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
    let job = {user : user, companyname : companyname,salary : salary , jobtype:jobtype , employmenttype:employmenttype , worktime : worktime , qualti:qualti , file : jobfile , image : jobimage , date : workdate ,contact : contact, jobpos : jobpos , editdate : dateTime,
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

router.get("/Liked", middleware.isloggedIn, function(req, res){
    res.render("Liked");
})


var storage = multer.diskStorage({
    destination : function(req,gile,cb){
        cb(null,'./public/images/');
    },
    filename : function(req,gile,cb){
        cb(null,Date.now()+".jpg");
    },
})

upload = multer({ storage : storage})

router.get("/profile/:id",middleware.isloggedIn,function(req, res){
    res.render("findworker/operatorprofile");
})

router.get("/profile/:id/edit",middleware.isloggedIn,function(req, res){
    res.render("findworker/editoperatorprofile");
})

router.put("/profile/:id/edit" ,upload.single("img") ,middleware.isloggedIn, function(req,res){
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
            res.redirect("/findworker/profile/"+req.params.id);
        }
    });
});


module.exports = router;