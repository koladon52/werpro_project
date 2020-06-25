const express = require("express"),
      path = require("path"),
      bodyParser =  require("body-parser"),
      mongoose = require("mongoose"),
      passport = require('passport'),
      flash = require('connect-flash'),
      passportlocal = require('passport-local'),
      methodOverride = require('method-override'),
      User = require('./models/user'),
      indexRoutes = require('./routes/index'),
      workerRoute = require('./routes/worker'),
      operatorRoute = require('./routes/operator'),
      adminRoute    = require('./routes/admin')
      ;

const { exec } = require("child_process");
let app = express();

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Views')));

mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);

// mongoose.connect('mongodb+srv://koladon52:subpadol52@cluster0-euzvy.mongodb.net/webpro',{ useNewUrlParser: true })
mongoose.connect('mongodb+srv://koladon52:subpadol52@cluster0-euzvy.mongodb.net/project_web?retryWrites=true&w=majority',{ useNewUrlParser: true })
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));

app.use(require('express-session')({
    secret: 'CSS227',
    resave: false,
    saveIninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));

app.use('/',indexRoutes);
app.use('/findjob',workerRoute);
app.use('/findworker',operatorRoute);
app.use('/admin',adminRoute);

const port = process.env.PORT|| 3000;
app.listen(port, function(res,req){
    console.log("LINK STARTO")
})
