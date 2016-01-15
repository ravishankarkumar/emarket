var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var productExport = require("./models/product.js");
var Product = productExport.model;

var userExport = require("./models/user.js");
var User = userExport.model;

var data = {
  convertId : function(id) {
    if(typeof(id) == 'string' ||
       typeof(id) == 'number') {
      id = mongoose.Types.ObjectId(id);
    }
    return id;
  },
  newProduct: function(){
  	var product= new Product();
  	console.log(product._id);
  	return product;
  },
  findByCategory: function(cat, done){
    Product.find({category:cat}, function(err, docs){
      done(docs);
      //console.log(docs);
    });
  },
  showCart: function(userId, done){
    User.findOne({_id: userId}, function(err, doc){
      done(doc.cart);
    });
  },
  getProduct: function(productId, done){
    Product.findOne({_id: productId}, function(err, doc){
      if(err){
        //TODO
      }
      done(doc);
    });
  },
  buyCart: function(userId, done){
    User.findOne({_id: userId}, function(err, doc){
      if(err){
        done(false, "Buy later!(Server down currently)");
      }
      doc.cart.products=[];
      doc.save();
      done(true, "You bought all the products in the cart");
    });
  },
  allProduct: function(done){
    Product.find(function(err,doc){
      if(err){
        //TODO
      };
      done(doc);
    });
  },
  addToCart: function(productId, userId, done){
    User.findOne({_id: userId}, function(err, doc){
      if(err){
        done( false, "Could not add product to cart!");
      }
      doc.cart.products.push(productId);
      doc.save();
      done();
    });
  },
  removeFromCart: function(productId, userId, done){
    User.findOne({_id: userId}, function(err, doc){
      if(err){
        //Todo
      }
      var tempIndex = doc.cart.products.indexOf(productId);
      if(tempIndex != -1){
        doc.cart.products.splice(tempIndex,1);
      }
      doc.save();
      done();
    });
  }
}

module.exports = data;
