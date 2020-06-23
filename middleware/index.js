 const Resume = require('../models/resume');
 const User   = require('../models/user');

let middlewareObj = {};

middlewareObj.isloggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','Please Login first');
    res.redirect('/login');
}


// middlewareObj.checkOwnerResume = function(req, res, next){
//     if(req.isAuthenticated()){
//         Resume.findById(req.params.id, function(err, foundUser){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundUser.user.id.equal(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect('back');
//                 }
//             }
//         })
//     } else {
//         res.redirect('back');
//     }
// }



middlewareObj.stateOperator = function(req, res, next){
    if(req.user.type === "operator"){
        return next();
        
    }
    req.flash('error','คุณได้เข้าสู่ระบบในฐานะ worker ไม่สามารถเข้าใช้งานหน้า operator ได้');
    res.redirect('/');
}

middlewareObj.stateWorker = function(req, res, next){
    if(req.user.type === "worker"){
        return next();
    }
    req.flash('error','คุณได้เข้าสู่ระบบในฐานะ operator ไม่สามารถเข้าใช้งานหน้า worker ได้'); 
    res.redirect('/');   
}

middlewareObj.checkdataoperator = function(req , res , next){
    User.findById(req.user._id , function(err,founduser){
        if(err){
            console.log(err);
        } else {
            if(founduser.img == "" || founduser.firstname == "" || founduser.lastname == "" || founduser.phone == "" || founduser.address == "" || founduser.jobtype == "" || founduser.aboutcompany == "" ){
                req.flash('error','please complete your profile');
                res.redirect( '/findworker/profile/' + req.user._id );
            } else {
                return next();
            }
        }
    })
}

middlewareObj.checkdataworker = function(req , res , next){
    User.findById(req.user._id , function(err,founduser){
        if(err){
            console.log(err);
        } else {
            if(founduser.img == "" || founduser.firstname == "" || founduser.lastname == "" || founduser.phone == "" || founduser.address == "" ){
                req.flash('error','please complete your profile');
                res.redirect( '/findjob/profile/' + req.user._id );
            } else {
                return next();
            }
        }
    })
}

middlewareObj.checkexpireresume = function(req, res , next){
    var dateTime = new Date()
   
    Resume.find({},function(error, allResume){
        if(error){
            console.log(error);
        } else
        {  
            for(let i = 0 ; i < allResume.length ; i++){
                if(dateTime >= allResume[i].expiredate){
                    console.log(dateTime)
                    console.log(allResume[i].expiredate)
                    console.log(allResume[i].user.id)
                   User.findById(allResume[i].user.id,function(err, user){
                       console.log(user);
                        user.resumes.pull(allResume[i]._id);
                        user.save();
                        console.log('removed expire resume');
                        const resumepath  = './public/resume/' + allResume[i].file;
                        const imagepath  = './public/resumeimage/' + allResume[i].image;
                        fs.unlink(resumepath , function(err){
                            if(err){
                                console.log(err);
                            } else {
                                console.log('unlink file success');
                            }
                        })
                        fs.unlink(imagepath , function(err){
                            if(err){
                                console.log(err);
                            } else {
                                console.log('unlink file success');
                            }
                        })
                        User.find({favouriteresume : allResume[i]._id}, function(err , currentuser){
                            if(err){
                                console.log(err)
                            } else {
                            console.log(currentuser)
                            for(let j = 0 ; j < currentuser.length ; j++){
                                for(let k = 0 ; k < currentuser[j].favouriteresume.length ; k++){
                                    if(currentuser[j].favouriteresume[k].equals(allResume[i]._id)){
                                        console.log(j)
                                        console.log(currentuser[j])
                                        console.log(currentuser[j].favouriteresume[k])
                                        console.log(allResume[i]._id)
                                        console.log(currentuser[j].favouriteresume)
                                        currentuser[j].favouriteresume.pull(allResume[i]._id);
                                        currentuser[j].save();
                                        console.log('removed from your favourite resume');
                                    }
                                }
                            
                             }
                            }
                        })
                        
                   })
                   Resume.findByIdAndRemove(allResume[i]._id, function(err,resume){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('delete resumes success ');
                        resume.save();
                    }
                });
                }    

            }
            
        }
    })
    return next();
}


middlewareObj.checkexpirejob = function(req, res , next){
    var dateTime = new Date()
   
    Jobdetail.find({},function(error, allJob){
        if(error){
            console.log(error);
        } else
        {  
            for(let i = 0 ; i < allJob.length ; i++){
                if(dateTime >= allJob[i].expiredate){
                    console.log(dateTime)
                    console.log(allJob[i].expiredate)
                    console.log(allJob[i].user.id)
                   User.findById(allJob[i].user.id,function(err, user){
                       console.log(user);
                        user.jobs.pull(allJob[i]._id);
                        user.save();
                        console.log('removed expire resume');
                        const jobapppath  = './public/resume/' + allJob[i].file;
                        const jobimagepath  = './public/resumeimage/' + allJob[i].image;
                        fs.unlink(jobapppath , function(err){
                            if(err){
                                console.log(err);
                            } else {
                                console.log('unlink file success');
                            }
                        })
                        fs.unlink(jobimagepath , function(err){
                            if(err){
                                console.log(err);
                            } else {
                                console.log('unlink file success');
                            }
                        })
                        User.find({favouritejob : allJob[i]._id}, function(err , currentuser){
                            if(err){
                                console.log(err)
                            } else {
                            console.log(currentuser)
                            for(let j = 0 ; j < currentuser.length ; j++){
                                for(let k = 0 ; k < currentuser[j].favouritejob.length ; k++){
                                    if(currentuser[j].favouritejob[k].equals(allJob[i]._id)){
                                        console.log(j)
                                        console.log(currentuser[j])
                                        console.log(currentuser[j].favouritejob[k])
                                        console.log(allJob[i]._id)
                                        console.log(currentuser[j].favouritejob)
                                        currentuser[j].favouritejob.pull(allJob[i]._id);
                                        currentuser[j].save();
                                        console.log('removed from your favourite resume');
                                    }
                                }
                            
                             }
                            }
                        })
                        
                   })
                   Jobdetail.findByIdAndRemove(allJob[i]._id, function(err,job){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('delete resumes success ');
                        job.save();
                    }
                });
                }    
            }
        }
    })
    return next();
}
module.exports = middlewareObj;