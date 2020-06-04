const mongoose = require('mongoose')
    //   passportlocalMongoose = require('passport-local-mongoose')
      ;

let jobSchema = new mongoose.Schema({
    companyname      : String,
    salary           : String,
    jobtype          : String,
    jobpos           : String,
    employmenttype   : String,
    worktime         : String,
    qualti           : String,
    date             : String,
    contact          : String,
    file             : String,
    editdate         : String,
    user : {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        username : String,
        img : String
    }
})

// ResumeSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('Jobdetail', jobSchema);