var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema(
    {
        "productId":String,
        "productName":String,
        "productPrice":String,
        "productImg":String,
        "productNum":String,
        "checked":String
    }
);
module.exports = mongoose.model('Good',productSchema);