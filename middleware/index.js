 const Resume = require('../models/resume');

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

// function stateOperator(req, res, next){
//     if(req.user.type === "operator"){
//         return next();
//     }
//     req.flash('error','You are logged as Worker');
// }

// function stateWorker(req, res, next){
//     if(req.user.type === "worker"){
//         return next();
//     }
//     req.flash('error','You are logged as Operator'); 
// }
