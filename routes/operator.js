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
    res.redirect("/");
})

router.get("/My_post",middleware.isloggedIn , middleware.stateOperator ,function(req, res){
    Jobdetail.find({} ,function(error, myJob){
        if(error){
            console.log(error);
        } else
        {
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

    var dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    
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

    Jobdetail.findByIdAndUpdate({_id:id},{$set:{companyname : companyname,salary : salary,qualti : qualti, employmenttype : employmenttype, jobtype : jobtype , jobpos : jobpos, date : workdate , finishtime : finishtime ,starttime : starttime , contact : contact , file : jobfile , image : jobimage , editdate : dateTime ,lon : lon, lat : lat , location : location , district : district , subdistrint : subdistrict , postcode : postcode , province : province , aoi : aoi , country : country}}, function(error,profile){
        if(error){
            console.log("error"); 
        } else {
            res.redirect("/findworker/My_post/" + req.params.id);
        }
    });
})

router.get("/My_post/:id/edit",middleware.isloggedIn , middleware.stateOperator ,function(req, res){
    Jobdetail.findById(req.params.id, function(error, idJob){
        if(error){
            console.log("Error");
        } else {
            res.render("findworker/editJob",{job:idJob});
        }
    });
})

router.delete("/My_post/:id/edit",middleware.isloggedIn , middleware.stateOperator , function(req,res){

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

router.get("/workerlist",middleware.isloggedIn , middleware.stateOperator ,function(req, res){
    Resume.find({},function(error, allResume){
        if(error){
            console.log(error);
        } else
        {
            res.render("findworker/findworkerlist",{Resume:allResume});
        }
    })
});

router.post("/wokerlist/:id/addfavourite", middleware.isloggedIn ,function(req, res) {
    let id = req.user._id;
    let worker = req.params.id;
    let thisfav = false;
    User.findById(id, function(err , user){
        if(err){
            console.log(err);
        } else {
            for(let i = 0 ; i < user.favourite.length ; i++){
                if(user.favourite[i].equals(worker)){
                    console.log('you have favourited this job')
                    thisfav = true;
                    break;
                }
                else{
                    continue;
                }
            }
            if(thisfav == false){
                user.favourite.push(worker);
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
            user.favourite.pull(worker);
            user.save()      
            console.log('delete success');
            res.end()
        }
      })
    }
  })
});

router.get("/worker_like",middleware.isloggedIn,async function(req,res)
{
    User.findById(req.user._id).populate('favourite').exec(function(err, idWorker){
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
            for(let i = 0 ; i < req.user.favourite.length ; i++){
                if(req.user.favourite[i].equals(req.params.id)){
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


// router.post('/joblist',middleware.isloggedIn, function(req , res , next){
//     var fuzzyfiltercompanyname   = req.body.searchcompanyname;
//     var filtersalary             = req.body.searchsalary;
//     var filteremploymenttype     = req.body.searchemploymenttype;
//     var filterjobtype        =  req.body.searchjobtype;
    
//     console.log(fuzzyfiltercompanyname);
//     console.log(filtersalary);
//     console.log(filteremploymenttype);
//     console.log(filterjobtype);
//     const filtercompanyname = new RegExp(escapeRegex(fuzzyfiltercompanyname), 'gi');

//     // if(fuzzyfiltercompanyname != '' && filtersalary != '' && filteremploymenttype != ''){
//     //     console.log('1');
//     //     var filterParemater = { $and : [{ companyname : fuzzyfiltercompanyname } , { $and : [{salary : filtersalary},{employmenttype : filteremploymenttype}]}] }
//     // } else if (fuzzyfiltercompanyname != '' && filtersalary == '' && filteremploymenttype != ''){
//     //     console.log('2');
//     //     var filterParemater = { $and:[{ companyname : fuzzyfiltercompanyname},{employmenttype : filteremploymenttype}]}
//     // } else if (fuzzyfiltercompanyname == '' && filtersalary != '' && filteremploymenttype !=''){
//     //     console.log('3');
//     //     var filterParemater = { $and:[{ salary : filtersalary},{employmenttype : filteremploymenttype}]}
//     // } else {
//     //     console.log('4');
//     //     var filterParemater = {};
//     // }

//     // if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== ''){
//     //     var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype}]};
//     // } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== ''){
//     //     var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype}]};
//     // } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== ''){
//     //     var filterParemater={ $and :[{ companyname : filtercompanyname},{employmenttype : filteremploymenttype}]};
//     // } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype === ''){
//     //     var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary}]};
//     // } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === ''){
//     //     var filterParemater={ $and :[{ companyname : filtercompanyname}]};
//     // } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === ''){
//     //     var filterParemater={ $and :[{ salary : filtersalary}]};
//     // } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== ''){
//     //     var filterParemater={ $and :[{ employmenttype : filteremploymenttype}]};
//     // } else {
//     //     var filterParemater = {};
//     // }

//     if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== '' && filterjobtype !== ''){ 1111
//         var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== '' && filterjobtype !== ''){ 0111
//         var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== '' && filterjobtype !== ''){1011
//         var filterParemater={ $and :[{ companyname : filtercompanyname},{employmenttype : filteremploymenttype},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype === '' && filterjobtype !== ''){1101
//         var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== '' && filterjobtype === ''){1110
//         var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype}]};
//     } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== '' && filterjobtype !== ''){0011
//         var filterParemater={ $and :[{employmenttype : filteremploymenttype},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === '' && filterjobtype !== ''){1001
//         var filterParemater={ $and :[{ companyname : filtercompanyname},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype === '' && filterjobtype === ''){1100
//         var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary}]};
//     } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== '' && filterjobtype === ''){0110
//         var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype}]};
//     } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === '' && filterjobtype !== ''){0101
//         var filterParemater={ $and :[{salary : filtersalary},{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== '' && filterjobtype === ''){1010
//         var filterParemater={ $and :[{companyname : filtercompanyname},{employmenttype : filteremploymenttype}]};
//     } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype === '' && filterjobtype !== ''){0001
//         var filterParemater={ $and :[{jobtype : filterjobtype}]};
//     } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === '' && filterjobtype === ''){1000
//         var filterParemater={ $and :[{ companyname : filtercompanyname}]};
//     } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === '' && filterjobtype === ''){0100
//         var filterParemater={ $and :[{salary : filtersalary}]};
//     } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== '' && filterjobtype === ''){0010
//         var filterParemater={ $and :[{employmenttype : filteremploymenttype}]};
//     }  else {
//         var filterParemater = {};
//     }

//     console.log(filterParemater);

//     var jobfilter = Jobdetail.find(filterParemater);
//     jobfilter.exec(function(err,data){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(data);
//             res.render("findjob/joblist",{Job:data});
//         }
//     })
// });

router.get("/postjob", middleware.isloggedIn , middleware.stateOperator , function(req, res){
    res.render("findworker/postjob");
})

router.post("/postjob",uploadjob.any(), middleware.isloggedIn , middleware.stateOperator ,function(req, res){

    var dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

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

    var dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

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