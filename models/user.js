const mongoose = require('mongoose'),
      passportlocalMongoose = require('passport-local-mongoose')
      ;

let UserSchema = new mongoose.Schema({
    username : String,
    email    : String,
    password : String,
    type     : String
})

UserSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// module.exports.getUserById=function(id,callback){
//     User.findById(id,callback);
// }

// module.exports.getUserByName=function(id,callback){
//     var query = {
//         username : username,
//         type : Type
//     };
//     User.findOne(query,callback);
// }