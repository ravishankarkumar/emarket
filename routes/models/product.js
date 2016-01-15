var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  name 			: {type: String, default: 'Stylish T-shirt'},
  cartImage		: {type: String, default: 'images/thumbnail/product16.jpg'},
  homeImage		: {type: String, default: 'images/home/product16.jpg'},
  price			: {type: Number, default : 499},
  category		: {type: String, default: 'kids'}
});

module.exports = { model: mongoose.model('Product', schema), schema: schema }