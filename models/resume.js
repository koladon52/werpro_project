const mongoose = require('mongoose')
      ;

let ResumeSchema = new mongoose.Schema({
    image          : String,
    firstname      : String,
    lastname       : String,
    jobtype        : String,
    employmenttype : String,
    starttime      : String,
    finishtime     : String,
    description    : String,
    date           : String,
    contact        : String,
    file           : String,
    editdate       : String,
    postdate       : String,
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


module.exports = mongoose.model('Resume', ResumeSchema);