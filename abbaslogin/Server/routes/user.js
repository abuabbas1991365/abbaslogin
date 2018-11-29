var express = require('express');
var router = express.Router();
    var config = require('../config/config')[process.env.NODE_ENV || 'development'],
    mysql = require('mysql'),
    async = require('async'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require('crypto'),
    fs = require("fs");

    
router.get('/listout', function (req, res, next) {
 var connection;
	async.waterfall([
			function(next){
				connection=mysql.createConnection(config.db,next);
			    connection.connect();
               connection.query("select * from  user_info",next);
            	 },
			
			],function(err,result){
			if(connection){
				connection.end();
				connection=null;
			}
			if(err)
		    	return res.status(201).json(err);
		    else{
		    	console.log(result)
                return res.status(201).json(result);	
		   
		    }
          	
     });
 });   
 
   router.post('/register', function (req, res, next) {
		
 var connection;
	async.waterfall([
			function(next){
				connection=mysql.createConnection(config.db,next);
			    connection.connect();
                var response={
		    		email:req.body.email,
		    	    username:req.body.username,
		    	    password:crypto.createHash('md5').update(req.body.password).digest("hex"),
		    	  }
		    	 connection.query("INSERT INTO user_info set ?",[response]);
			 },
			
			],function(err,result){
			if(connection){
				connection.end();
				connection=null;
			}
			if(err)
		    	return res.status(201).json(err);
		    else
          	return res.status(201).json("inseted Success");
     });
 });   
 

passport.use('local',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
},
    function (username, password, done) {
    var connection;
		password=crypto.createHash('md5').update(password).digest("hex");
		async.waterfall([
			function(next){
		    connection=mysql.createConnection(config.db,next);
	        connection.connect();
			connection.query('select * from user_info where email="'+username+'" and password="'+password+'"',next);
	  		},	 
			function(users,next){
               console.log("hi");
               			if(users && users.length>0){
					var user=createUserObject(users);
					return done(null, user);
				 } else
					  return done(null, false, { message: 'Incorrect username.' });
			},
			
		],function(err,result){
			if(connection){
				connection.end();
				connection=null;
			}
			if(err)
				done(null,false,err);
			else
				done(err,result);
		});
	
    }
));


passport.serializeUser(function(user, done) {
	
	done(null, {userid:user._id.toString()});
});

passport.deserializeUser(function(id, done){
	var connection;
	async.waterfall([
		function(next){
			connection=mysql.createConnection(config.db,next);
	        connection.connect();
			connection.query('select * from user_info where userid='+id.userid,next);
			console.log('select * from user_info where userid='+id.userid);
			},
			function(users,next){
               console.log("hi");
               			if(users && users.length>0){
					var user=createUserObject(users);
					 done(null, user);
				 } else
					 done(null, false, { message: 'Incorrect username.' });
			},
			
		],function(err,result){
			if(connection){
				connection.end();
				connection=null;
			}
			if(err)
				done(null,false,err);
			else
				done(err,result);
		});
	
    });

function createUserObject(users){
 var user={
	  	
	     _id:users[0].userid,
	     username:users[0].username,
	   	 email:users[0].email,
		 password:users[0].password,
	   }
	return user;
}

router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err, user, info) {
    if (err) {
     return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); }
    req.logIn(user, function(err) {
      if (err) { return res.status(501).json(err); }
      return res.status(200).json({message:'Login Success'});
    });
  })(req, res, next);
});

router.get('/user',isValidUser,function(req,res,next){
	
  return res.status(200).json(req.user);
});

router.get('/logout',isValidUser, function(req,res,next){
  req.logout();
 
  return res.status(200).json({message:'Logout Success'});
})

function isValidUser(req,res,next){
  console.log(req);
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}
module.exports = router;

