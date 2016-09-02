var express = require('express');
var router = express.Router();
var Block = require('../models/block');

// 회원 차단
router.post('/', function (req, res, next) {


    // 차단하는 사람ID, 차단 당하는 사람 ID
    var blockingId = req.user.id;
    var blockedId = parseInt(req.body.blockedId, 10);
    Block.insertBlock(blockingId, blockedId, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send({
            message: "차단 되었습니다."
        });
    });

});

module.exports = router;

