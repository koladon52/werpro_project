const mongoose = require('mongoose')
    //   passportlocalMongoose = require('passport-local-mongoose')
      ;

let jobSchema = new mongoose.Schema({
    image            : String,
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
    editdate         : Date,
    postdate         : Date,
    lon              : String,
    lat              : String,
    location         : String,
    district         : String,
    subdistrict      : String,  
    postcode         : String,
    province         : String,
    aoi              : String,
    country          : String,
    expiredate       : Date,
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