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

router.get("/", middleware.isloggedIn , middleware.stateOperator , function(req, res){
    res.redirect("/findworker/profile/"+req.user._id);
})

router.get("/My_post",middleware.isloggedIn , middleware.stateOperator , middleware.checkexpirejob , middleware.checkdataoperator ,function(req, res){
    var dateTime = new Date()
    Jobdetail.find({} ,function(error, myJob){
        if(error){
            console.log(error);
        } else{
            res.render("findworker/My_post",{Job:myJob});
        }
    })
    
});


router.get("/My_post/:id",middleware.isloggedIn , middleware.stateOperator ,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idjob){
        if(error){
            console.log(error);
        } else {
            res.render("findworker/My_postdetail",{job:idjob});
        }
    });
});

router.put("/My_post/:id/edit",uploadjob.any(),middleware.isloggedIn , middleware.stateOperator ,function(req,res){

    var dateTime = new Date()
    
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
    let starttime         = req.body.starttime;
    let finishtime         = req.body.finishtime;
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
                    } else {console.log('unlink success');}
                    
                    
                })
                const jobfilepath = './public/jobapplication/' + foundjob.file;
                fs.unlink(jobfilepath, function(err){
                    if(err){
                        console.log(err);
                    } else {console.log('unlink success');}
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
                    } else {console.log('unlink success');}
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
                    } else {console.log('unlink success');}
                })
            }
        })
    } 

    Jobdetail.findByIdAndUpdate({_id:id},{$set:{companyname : companyname,salary : salary,qualti : qualti, employmenttype : employmenttype, jobtype : jobtype , jobpos : jobpos, date : workdate , finishtime : finishtime ,starttime : starttime , contact : contact , file : jobfile , image : jobimage , editdate : dateTime ,lon : lon, lat : lat , location : location , district : district , subdistrint : subdistrict , postcode : postcode , province : province , aoi : aoi , country : country}}, function(error,profile){
        if(error){
            console.log(error); 
        } else {
            res.redirect("/findworker/My_post/" + req.params.id);
        }
    });
})

router.get("/My_post/:id/edit",middleware.isloggedIn , middleware.stateOperator , middleware.checkdataoperator ,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idJob){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/editJob",{job:idJob});
        }
    });
})

router.delete("/My_post/:id/edit",middleware.isloggedIn , middleware.stateOperator , middleware.checkdataoperator ,function(req,res){

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
            User.find({favouritejob : foundjob._id}, function(err , currentuser){
                if(err){
                    console.log(err)
                } else {
                console.log(currentuser)
                for(let j = 0 ; j < currentuser.length ; j++){
                    for(let k = 0 ; k < currentuser[j].favouritejob.length ; k++){
                        if(currentuser[j].favouritejob[k].equals(foundjob._id)){
                            currentuser[j].favouritejob.pull(foundjob._id);
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
            res.redirect('/findworker/My_post');
        }
    });
})

router.get("/workerlist",middleware.isloggedIn , middleware.stateOperator , middleware.checkdataoperator ,middleware.checkexpireresume ,function(req, res){
    let dosearch = false ;
    // var dateTime = new Date()
    Resume.find({},function(error, allResume){
        if(error){
            console.log(error);
        } else{  
            res.render("findworker/findworkerlist",{Resume:allResume , dosearch : dosearch});
        }
    })
});

router.post("/workerlist/:id/addfavourite", middleware.isloggedIn ,function(req, res) {
    let id = req.user._id;
    let worker = req.params.id;
    let thisfav = false;
    User.findById(id, function(err , user){
        if(err){
            console.log(err);
        } else {
            for(let i = 0 ; i < user.favouriteresume.length ; i++){
                if(user.favouriteresume[i].equals(worker)){
                    console.log('you have favourited this job')
                    thisfav = true;
                    break;
                }
                else{
                    continue;
                }
            }
            if(thisfav == false){
                user.favouriteresume.push(worker);
                user.save();
                console.log('add success');
                res.end()
            }
        }
    })
});

router.delete("/workerlist/:id/removefavourite", middleware.isloggedIn ,function(req, res) {
    let id = req.user._id;
    let worker = req.params.id;
    Resume.findById(worker,function(err,post){
    let thisfav = false;
    if(err)
    {
      return res.send(err);
    }
    else
    {
      User.findById(id,function(err,user)
      {
        if(err)
        {
          return res.send(err);
        }
        else
        {
            user.favouriteresume.pull(worker);
            user.save()      
            console.log('delete success');
            res.end()
        }
      })
    }
  })
});

router.get("/worker_like" , middleware.isloggedIn , middleware.stateOperator, middleware.checkexpireresume, middleware.checkdataoperator , async function(req,res)
{
    var dateTime = new Date()

    User.findById(req.user._id).populate('favouriteresume').exec(function(err, idWorker){
        if(err){
            console.log(err);
        } else {
            console.log(idWorker)
            res.render("findworker/favouriteworker",{favouriteworker : idWorker});      
            }
    })
})

router.get("/workerlist/:id",middleware.isloggedIn , middleware.stateOperator ,function(req, res){
    let favouriteThisResume = false;
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log(error);
        } else {
            for(let i = 0 ; i < req.user.favouriteresume.length ; i++){
                if(req.user.favouriteresume[i].equals(req.params.id)){
                    favouriteThisResume = true;
                    break;
                } else {
                    continue;
                }
            }
            console.log(favouriteThisResume)
            res.render("findworker/workdetail",{ resume : idResume , favouriteThisResume : favouriteThisResume});
        }
    });
})


router.post('/workerlist',middleware.isloggedIn, function(req , res , next){
    
    var filtersalary             = req.body.searchsalary;
    var filteremploymenttype     = req.body.searchemploymenttype;
    var filterjobtype            = req.body.searchjobtype;
    
    console.log(filtersalary);
    console.log(filteremploymenttype);
    console.log(filterjobtype);


    if(filterjobtype !== '' && filtersalary !== '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{ jobtype : filterjobtype},{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    } else if(filterjobtype === '' && filtersalary !== '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    } else if(filterjobtype !== '' && filtersalary === '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{ jobtype : filterjobtype},{employmenttype : filteremploymenttype}]};
    } else if(filterjobtype !== '' && filtersalary !== '' && filteremploymenttype === ''){
        var filterParemater={ $and :[{ jobtype : filterjobtype},{salary : filtersalary}]};
    } else if(filterjobtype !== '' && filtersalary === '' && filteremploymenttype === ''){
        var filterParemater={ $and :[{ jobtype : filterjobtype}]};
    } else if(filterjobtype === '' && filtersalary !== '' && filteremploymenttype === ''){
        var filterParemater={ $and :[{ salary : filtersalary}]};
    } else if(filterjobtype === '' && filtersalary === '' && filteremploymenttype !== ''){
        var filterParemater={ $and :[{ employmenttype : filteremploymenttype}]};
    } else {
        var filterParemater = {};
    }

    console.log(filterParemater);
    let dosearch = true;
    var resumefilter = Resume.find(filterParemater);
    resumefilter.exec(function(err,data){
        if(err){
            console.log(err);
        } else {
            console.log(data);
            res.render("findworker/findworkerlist",{ Resume:data , dosearch : dosearch});
        }
    })
});

router.get("/postjob", middleware.isloggedIn , middleware.stateOperator , middleware.checkdataoperator  , function(req, res){
    
    res.render("findworker/postjob");
})

router.post("/postjob",uploadjob.any(), middleware.isloggedIn , middleware.stateOperator , middleware.checkdataoperator  ,function(req, res){

    var dateTime = new Date()
    var expire = new Date(( dateTime.getTime() + 60000  ));
 
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
    let starttime         = req.body.starttime;
    let finishtime        = req.body.finishtime;
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
    let job = {user : user, companyname : companyname,salary : salary , jobtype:jobtype , employmenttype:employmenttype , finishtime : finishtime , starttime : starttime , qualti:qualti , file : jobfile , image : jobimage , date : workdate ,contact : contact, jobpos : jobpos , editdate : dateTime,
    lon : lon, lat : lat , location : location , district : district , subdistrint : subdistrict , postcode : postcode , province : province , aoi : aoi , country : country , postdate : dateTime , expiredate : expire};
    
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



var storage = multer.diskStorage({
    destination : function(req,gile,cb){
        cb(null,'./public/images/');
    },
    filename : function(req,gile,cb){
        cb(null,Date.now()+".jpg");
    },
})

upload = multer({ storage : storage})

router.get("/profile/:id",middleware.isloggedIn, middleware.stateOperator ,function(req, res){
    res.render("findworker/operatorprofile");
})

router.get("/profile/:id/edit", middleware.isloggedIn , middleware.stateOperator ,function(req, res){
    res.render("findworker/editoperatorprofile");
})

router.put("/profile/:id/edit" ,upload.single("img") , middleware.stateOperator ,middleware.isloggedIn, function(req,res){

    var dateTime = new Date()

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
        User.findByIdAndUpdate({_id:id},{$set:{ companyname : req.body.companyname , phone : req.body.phone , address : req.body.address , img : profileimage , editdate : dateTime , aboutcompany : req.body.aboutcompany , jobtype : req.body.jobtype}}, function(error,profile){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/findworker/profile/"+req.params.id);
        }
    });
});


module.exports = router;