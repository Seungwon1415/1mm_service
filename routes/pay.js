var express = require('express');
var router = express.Router();
var Pay = require('../models/pay');


router.post('/', function (req, res, next) {

    var listeningPay = {};
    listeningPay.answerId = parseInt(req.body.answerId, 10);
    listeningPay.date = req.body.date;
    listeningPay.id = req.user.id;

    Pay.payAnswerListening(listeningPay, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send({
            message: "나도 듣기가 결제 되었습니다."
        });
    });
});


module.exports = router;