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

module.exports = middlewareObj;

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
