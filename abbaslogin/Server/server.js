  var express =       require('express')
    , http =        require('http')
    , path =        require('path')
    , env =         process.env.NODE_ENV || 'development'
    , config =      require('./config/config')[env]
    , fs = require('fs')
    , _ = require('underscore');
var passport = require('passport');
var session = require('express-session');
var usersRouter = require('./routes/user');
var cors= require('cors');
var logger = require('morgan');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var app = express();  
app.use(cors({
  origin:['http://localhost:4200','http://127.0.0.1:4200'],
  credentials:true
}));
app.use(session({

  name:'myname.sid',
  resave:false,
  saveUninitialized:false,
  secret:'secret',
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  },
 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


app.set('port', process.env.PORT || config.port || 3005);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});


