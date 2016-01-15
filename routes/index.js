"use strict"

var data = require("./data.js");

var express = require('express');
var router = express.Router();
var passport = require('passport');
//for file upload
var easyimg = require("easyimage");
var fs = require("fs");
var multer = require("multer");
var upload = multer({dest: './public/uploads/'});


// GET home page.

router.get('/', function(req, res, next) {
  if(req.user && req.user.local){
    res.render('index', { title: 'E-Market Home', user: req.user.local.email });
  } else {
    res.render('index', { title: 'E-Market Home'});
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login to E-Market'});
});

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up for E-Market'});
});

router.get('/cart', isLoggedIn, function(req, res, next) {
  res.render('cart', { title: 'Your cart', user: req.user.local.email });
});

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

router.get('/categorised/:cat', function(req, res,next){
  data.findByCategory(req.param("cat"), function(data){
    res.send(data);
  });
});

router.get('/allProduct', function(req, res, next){
  data.allProduct(function(data){
    res.send(data);
  });
});

router.get('/addToCart/:productId', isLoggedIn, function(req, res,next){
  data.addToCart(req.param("productId"), req.user._id, function(){
    res.redirect("/");
  });
});

router.get('/removeFromCart/:productId', isLoggedIn, function(req, res,next){
  data.removeFromCart(req.param("productId"), req.user._id, function(){
    res.redirect("/cart");
  });
});

router.get('/buyCart', isLoggedIn, function(req, res,next){
  data.buyCart(req.user._id, function(status, receivedMessage){
    res.render('index', { title: 'E-Market Home', user: req.user.local.email, success: status, message: receivedMessage});
  });
});

router.get('/showCart', isLoggedIn, function(req, res, next) {
  //res.render('addnewproduct', { title: 'Add New Product Here', user: req.user.local.email });
  data.showCart(req.user._id, function(data){
    res.send(data);
  })
});

router.get('/getProduct/:productId', function(req, res, next) {
  data.getProduct(req.param("productId"), function(data){
    res.send(data);
  })
});

router.get('/addnewproduct', isLoggedIn, isAdmin, function(req, res, next) {
  res.render('addnewproduct', { title: 'Add New Product Here', user: req.user.local.email });
});

router.post('/addnewproduct', isLoggedIn, isAdmin, upload.single('pic'), function(req, res, next) {
  if(req.file){
    var temp = req.file.originalname;
    temp = temp.split(".");
    var extension = temp[temp.length -1];
    var name = req.file.filename;
    var newname = name + "." + extension;
    var oldpath = "./public/uploads/" + name;
    var newpath = "./public/uploads/" + newname;
    fs.rename(oldpath, newpath, function(err){
      if(err){
        console.log(err);
      }
    });
    easyimg.thumbnail({
      src: "./public/uploads/"+newname,
      dst: "./public/thumbnail/"+newname,
      width: 100,
      height: 100
    }).then(function(image){
      console.log("thumbnail saved");
    }, function(err){
      console.log(err);
    });
    easyimg.thumbnail({
      src: "./public/uploads/"+newname,
      dst: "./public/home/"+newname,
      width: 300,
      height: 300
    }).then(function(image){
      console.log("thumbnail saved");
    }, function(err){
      console.log(err);
    });
    var pathtosave = "/home/"+newname;
    var thumbtosave = "/thumbnail/"+newname;
  }
	var p = data.newProduct();
  if(pathtosave){
    p.homeImage = pathtosave;
  }
  if(thumbtosave){
    p.cartImage = thumbtosave;
  }
  if(req.body.productname){
    p.name=req.body.productname;
  };
  if(req.body.price){
    p.price=req.body.price;
  };
  if(req.body.category){
    p.category=req.body.category;
  };
  p.save(function(err){
    if(!err){
      console.log("Data has been saved");
    } else {
      console.log("Error occurred");
      res.render('index', { title: 'E-Market Home', user: req.user.local.email, success: false, message: 'cannot add product' });
    }
  });
    res.render('index', { title: 'E-Market Home', user: req.user.local.email, success:true, message: 'Your Product have been added. Click on category to check new addition'});
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/*temporary*/
router.get('/man', function(req, res, next) {
  res.json({"dt": "man"});
});

/*temporary ends*/

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

// route middleware to check if user is admin
function isAdmin(req, res, next) {
  // if user is admin, carry on
  if(req.user.local.email=="admin"){
    return next();
  };
  // if not an Admin redirect them to the home page
  res.redirect('/login');
}
