var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": [{

    "orderId": String,
    "orderTotal": String,
    "orderStatus": String,
    "createDate": String,
    "goodsList": {
      "productId": String,
      "productName": String,
      "productPrice": String,
      "productImg": String,
      "productNum": String,
      "checked": String

    }
  }],
  "cartList": [{
    "productId": String,
    "productName": String,
    "productPrice": String,
    "productImg": String,
    "checked": String,
    "productNum": String
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": String,
    "tel": String,
    "isDefault": Boolean
  }]
});

module.exports = mongoose.model("User", userSchema);
