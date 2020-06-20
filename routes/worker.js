const express = require('express'),
      router = express.Router();
      fs = require('fs'),
      User = require('../models/user'),
      Resume = require('../models/resume'),
      Jobdetail = require('../models/jobdetail'),
      middleware = require('../middleware'),
      multer = require('multer')
      ;


router.get("/",middleware.isloggedIn, function(req, res){
    res.redirect("/");
})

router.get("/resume", middleware.isloggedIn,function(req, res){
    res.render("findjob/resume");
})

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

router.post("/resume", uploadtest.any() , middleware.isloggedIn,function(req, res){
        
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
        let contact        = req.body.contact;
        let salary         = req.body.salary;
        let resume = {user : user,firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:worktime,description:description, contact : contact, file:file,date:workdate,editdate : dateTime , image : image , salary : salary};

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

router.get("/My_resume",middleware.isloggedIn,function(req, res){
    Resume.find({} ,function(error, myResume){
        if(error){
            console.log(error);
        } else
        {
            res.render("findjob/My_resume",{Resume:myResume});
        }
    })
});


router.get("/My_resume/:id",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log("Error");
        } else {
            res.render("findjob/My_resumedetail",{resume:idResume});
        }
    });
});

router.put("/My_resume/:id/edit",uploadtest.any(),middleware.isloggedIn ,function(req,res){
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
    let contact        = req.body.contact;
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

    Resume.findByIdAndUpdate({_id:id},{$set:{firstname : firstname,lastname : lastname,jobtype:jobtype,employmenttype:employmenttype,worktime:worktime,description:description, file : resumefile , image : resumeimage ,date:workdate,editdate : dateTime , contact : contact}},function(err, updated){
        if(err){
            res.redirect('/');
        } else {
            res.redirect('/findjob/My_resume/' + req.params.id);
        }
    })
})

router.get("/My_resume/:id/edit",middleware.isloggedIn,function(req, res){
    Resume.findById(req.params.id, function(error, idResume){
        if(error){
            console.log("Error");
        } else {
            res.render("findjob/editResume",{resume:idResume});
        }
    });
})

router.delete("/My_resume/:id/edit",middleware.isloggedIn, function(req,res){
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
            User.findById(req.user._id, function(err, founduser){
                founduser.resumes.pull(foundresume);
                founduser.save();
                console.log("remove resume id from user")
            })
        }
        console.log("deleted complete")
    })

    Resume.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/findjob/My_resume');
        }
    });
})

// app.get("/like_job", middleware.isloggedIn, function(req, res){
//     Jobdetail.find({},function(error, allJob){
//         if(error){
//             console.log(error);
//         } else
//         {
//             res.render("findjob/favioritejob",{Job:allJob});
//         }
//     })
// })


router.post("/joblist/:id/addfavourite", middleware.isloggedIn ,function(req, res) {
    let id = req.user._id;
    let job = req.params.id;
    let thisfav = false;
    User.findById(id, function(err , user){
        if(err){
            console.log(err);
        } else {
            for(let i = 0 ; i < user.favourite.length ; i++){
                if(user.favourite[i].equals(job)){
                    console.log('User have favourited this job')
                    thisfav = true;
                    break;
                }
                else{
                    continue;
                }
            }
            if(thisfav == false){
                user.favourite.push(job);
                user.save();
                console.log('add success');
                res.end()
            }
        }
    })
});

router.delete("/joblist/:id/removefavourite", middleware.isloggedIn ,function(req, res) {
    let id = req.user._id;
    let job = req.params.id;
    Jobdetail.findById(job,function(err,post){
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
            user.favourite.pull(job);
            user.save()      
            console.log('delete success');
            res.end()
        }
      })
    }
  })
});


router.get("/job_like",middleware.isloggedIn,async function(req,res)
{
    User.findById(req.user._id).populate('favourite').exec(function(err, idjob){
        if(err){
            console.log(err);
        } else {
            console.log(idjob.favourite)
            res.render("findjob/favouritejob",{favouritejob : idjob});      
            }
    })
})

router.get("/joblist",middleware.isloggedIn,function(req, res){
    Jobdetail.find({},function(error, allJob){
        if(error){
            console.log(error);
        } else
        {
            res.render("findjob/joblist",{Job:allJob});
        }
    })
});

router.get("/joblist/:id",middleware.isloggedIn,function(req, res){
    let favouriteThisJob = false;
    Jobdetail.findById(req.params.id, function(error, idJob){
        if(error){
            console.log(error);
        } else {
            for(let i = 0 ; i < req.user.favourite.length ; i++){
                if(req.user.favourite[i].equals(req.params.id)){
                    favouriteThisJob = true;
                    break;
                } else {
                    continue;
                }
            }
            console.log(favouriteThisJob)
            res.render("findjob/jobdetail",{job:idJob,favouriteThisJob : favouriteThisJob});
        }
    });
})

router.post('/joblist',middleware.isloggedIn, function(req , res , next){
    var fuzzyfiltercompanyname   = req.body.searchcompanyname;
    var filtersalary             = req.body.searchsalary;
    var filteremploymenttype     = req.body.searchemploymenttype;
    var filterprovince         =  req.body.searchprovince;
    var filterprovince         =  "";
    console.log(fuzzyfiltercompanyname);
    console.log(filtersalary);
    console.log(filteremploymenttype);
    console.log(filterprovince);
    const filtercompanyname = new RegExp(escapeRegex(fuzzyfiltercompanyname), 'gi');

    // if(fuzzyfiltercompanyname != '' && filtersalary != '' && filteremploymenttype != ''){
    //     console.log('1');
    //     var filterParemater = { $and : [{ companyname : fuzzyfiltercompanyname } , { $and : [{salary : filtersalary},{employmenttype : filteremploymenttype}]}] }
    // } else if (fuzzyfiltercompanyname != '' && filtersalary == '' && filteremploymenttype != ''){
    //     console.log('2');
    //     var filterParemater = { $and:[{ companyname : fuzzyfiltercompanyname},{employmenttype : filteremploymenttype}]}
    // } else if (fuzzyfiltercompanyname == '' && filtersalary != '' && filteremploymenttype !=''){
    //     console.log('3');
    //     var filterParemater = { $and:[{ salary : filtersalary},{employmenttype : filteremploymenttype}]}
    // } else {
    //     console.log('4');
    //     var filterParemater = {};
    // }

    // if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== ''){
    //     var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    // } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== ''){
    //     var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    // } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== ''){
    //     var filterParemater={ $and :[{ companyname : filtercompanyname},{employmenttype : filteremploymenttype}]};
    // } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype === ''){
    //     var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary}]};
    // } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === ''){
    //     var filterParemater={ $and :[{ companyname : filtercompanyname}]};
    // } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === ''){
    //     var filterParemater={ $and :[{ salary : filtersalary}]};
    // } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== ''){
    //     var filterParemater={ $and :[{ employmenttype : filteremploymenttype}]};
    // } else {
    //     var filterParemater = {};
    // }

    if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== '' && filterprovince !== ''){ 1111
        var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype},{province : filterprovince}]};
    } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== '' && filterprovince !== ''){ 0111
        var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype},{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== '' && filterprovince !== ''){1011
        var filterParemater={ $and :[{ companyname : filtercompanyname},{employmenttype : filteremploymenttype},{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype === '' && filterprovince !== ''){1101
        var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype !== '' && filterprovince === ''){1110
        var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== '' && filterprovince !== ''){0011
        var filterParemater={ $and :[{employmenttype : filteremploymenttype},{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === '' && filterprovince !== ''){1001
        var filterParemater={ $and :[{ companyname : filtercompanyname},{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary !== '' && filteremploymenttype === '' && filterprovince === ''){1100
        var filterParemater={ $and :[{ companyname : filtercompanyname},{salary : filtersalary}]};
    } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype !== '' && filterprovince === ''){0110
        var filterParemater={ $and :[{salary : filtersalary},{employmenttype : filteremploymenttype}]};
    } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === '' && filterprovince !== ''){0101
        var filterParemater={ $and :[{salary : filtersalary},{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype !== '' && filterprovince === ''){1010
        var filterParemater={ $and :[{companyname : filtercompanyname},{employmenttype : filteremploymenttype}]};
    } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype === '' && filterprovince !== ''){0001
        var filterParemater={ $and :[{province : filterprovince}]};
    } else if(filtercompanyname !== '' && filtersalary === '' && filteremploymenttype === '' && filterprovince === ''){1000
        var filterParemater={ $and :[{ companyname : filtercompanyname}]};
    } else if(filtercompanyname === '' && filtersalary !== '' && filteremploymenttype === '' && filterprovince === ''){0100
        var filterParemater={ $and :[{salary : filtersalary}]};
    } else if(filtercompanyname === '' && filtersalary === '' && filteremploymenttype !== '' && filterprovince === ''){0010
        var filterParemater={ $and :[{employmenttype : filteremploymenttype}]};
    }  else {
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
    res.render("findjob/workerprofile");
})

router.get("/profile/:id/edit",middleware.isloggedIn,function(req, res){
    res.render("findjob/editworkerprofile");
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
            res.redirect("/findjob/profile/"+req.params.id);
        }
    });
});

module.exports = router;