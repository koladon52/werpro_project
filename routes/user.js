// const express = require('express'),
//       router = express.Router();
//       fs = require('fs'),
//       User = require('../models/user'),
//       Resume = require('../models/resume'),
//       Jobdetail = require('../models/jobdetail'),
//       middleware = require('../middleware'),
//       multer = require('multer')
//       ;


// var storage = multer.diskStorage({
//     destination : function(req,gile,cb){
//         cb(null,'./public/images/');
//     },
//     filename : function(req,gile,cb){
//         cb(null,Date.now()+".jpg");
//     },
// })

// upload = multer({ storage : storage})

// router.get("/profile",middleware.isloggedIn,function(req, res){
//     res.render("Autherization/profile");
// })

// router.get("/profile/edit",middleware.isloggedIn,function(req, res){
//     res.render("Autherization/editprofile");
// })

// router.put("/profile/:id/edit" ,upload.single("img") ,middleware.isloggedIn, function(req,res){
//     var today = new Date();
//     var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
//     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//     var dateTime = time+' '+date;

//     let id = req.body.id;
//     let img = req.body.oldimg;

//     if(req.file){
//         var profileimage = req.file.filename;
//         User.findById(req.params.id, function(err, founduser){
//             if(err){
//                 console.log(err)
//             } else {
//                 const imagepath = './public/images/' + founduser.img;
//                 fs.unlink(imagepath, function(err){
//                     if(err){
//                         console.log(err);
//                     }
//                 })
//             }
//         })
//     } else {
//         var profileimage = img;
//     }

    
//         User.findByIdAndUpdate({_id:id},{$set:{firstname : req.body.firstname,lastname : req.body.lastname,phone : req.body.phone, address : req.body.address, img : profileimage , editdate : dateTime}}, function(error,profile){
//         if(error){
//             console.log("error"); 
//         } else {
//             res.redirect("/profile");
//         }
//     });
// });

// module.exports = router;