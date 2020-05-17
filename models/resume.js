const mongoose = require('mongoose')
    //   passportlocalMongoose = require('passport-local-mongoose')
      ;

let ResumeSchema = new mongoose.Schema({
    username       : String,
    firstname      : String,
    lastname       : String,
    jobtype        : String,
    employmenttype : String,
    worktime       : String,
    description    : String,
    date           : String,
    contact        : String
})

// ResumeSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('Resume', ResumeSchema);