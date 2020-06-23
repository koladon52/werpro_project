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

module.exports = middlewareObj;