var express = require('express');
var router = express.Router();
var Follow = require('../models/follow');

// TODO: 3.팔로우 등록

router.post('/', function (req, res, next) {
    res.send({
        message: "팔로우를 등록하였습니다."
    });
});

// TODO: 4.팔로우 취소

router.delete('/', function (req, res, next) {
    res.send({
        message: "팔로우를 취소하였습니다."
    });
});


// 내 팔로우, 팔로잉 목록 등록
router.get('/', function (req, res, next) {
    var pageNo = parseInt(req.query.pageNo, 10);
    var count = parseInt(req.query.count, 10);
    var id = req.user.id;
   
    if (req.query.direction === 'to') { // direction이 to이면 내 팔로잉 목록 조회
        Follow.myFollowing(id, pageNo, count, function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        });
    } else if (req.query.direction === 'from') { // direction이 from이면 내 팔로우 목록 조회
        Follow.myFollower(id, pageNo, count, function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        });
    }
});


// TODO: 6.상대방 팔로우 목록
router.get('/:id', function (req, res, next) {
    var pageNo = parseInt(req.query.pageNo, 10);
    var count = parseInt(req.query.count, 10);
    var myId = req.user.id;
    var yourId = req.params.id;

    if (req.query.direction === 'to') {
        Follow.yourFollowing(myId, yourId, pageNo, count, function(err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        });
    }
    if (req.query.direction === 'from') {
        Follow.yourFollower(myId, yourId, pageNo, count, function(err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        });

    }
});

module.exports = router;