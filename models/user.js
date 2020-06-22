const mongoose = require('mongoose'),
      passportlocalMongoose = require('passport-local-mongoose')
      ;

let UserSchema = new mongoose.Schema({
    username : String,
    email    : String,
    password : String,
    type     : String,
    firstname: String,
    lastname : String,
    address  : String,
    phone    : String,
    img      : String,
    editdate : String,
    resumes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume"
        }
    ],
    jobs:     [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Jobdetail"
        }
    ],
    favourite:
    [   
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jobdetail',
            ref: 'Resume'
        }   
    ],
    // favouriteResume:
    // [   
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Resume'
    //     }   
    // ]

});

UserSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('User', UserSchema);

