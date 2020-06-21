const mongoose = require('mongoose')
    //   passportlocalMongoose = require('passport-local-mongoose')
      ;

let ResumeSchema = new mongoose.Schema({
    image          : String,
    firstname      : String,
    lastname       : String,
    jobtype        : String,
    employmenttype : String,
    worktime       : String,
    description    : String,
    date           : String,
    contact        : String,
    file           : String,
    editdate       : String,
    salary         : String,
    user : {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        username : String,
    },
    expire_at: {type: Date, default: Date.now, expires: 7200} 
})

// ResumeSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('Resume', ResumeSchema);