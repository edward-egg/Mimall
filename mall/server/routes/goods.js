var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/imoocmall');

mongoose.connection.on("conneced", function () {
  console.log('MongoDB connected success');
});

mongoose.connection.on("error", function () {
  console.log('MongoDB connected fail');
});

mongoose.connection.on("disconnected", function () {
  console.log('MongoDB connected disconnected');
});

router.get('/list', function (req, res, next) {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let priceLevel = req.query.priceLevel;
  let sort = req.query.sort;
  let skip = (page - 1) * pageSize;
  var priceGt;
  var priceLte;
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 500;
        break;
      case '1':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '2':
        priceGt = 1000;
        priceLte = 5000;
        break;
      case '3':
        priceGt = 5000;
        priceLte = 10000;
        break;
    }
    params = {
      productPrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({
    'productPrice': sort
  });
  goodsModel.exec({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});
//加入购物车
router.post('/addCart', function (req, res, next) {
  var userId = '10000077';
  var productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({
    userId: userId
  }, function (err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      console.log("userDoc:" + userDoc);
      if (userDoc) {
        let goodsItem = '';
        userDoc.cartList.forEach(item => {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message
              });
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              });
            }
          });
        } else {
          goods.findOne({
            productId: productId
          }, function (err1, doc) {
            if (err1) {
              res.json({
                status: "1",
                msg: err1.message
              });
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    });
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });

});
module.exports = router;
