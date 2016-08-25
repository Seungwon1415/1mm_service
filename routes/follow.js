var express = require('express');
var router = express.Router();

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
// TODO: 5.팔로우 목록

router.get('/', function (req, res, next) {
    if (req.query.direction === 'to') {
        res.send({
            "user_id": "1",
            "photo": "http://localhost/images//20160821.jpg",
            "nickname": "hong",
            "name": "홍길동",
            "distance": "50mm"
        });
    }
    if (req.query.direction === 'from') {
        res.send({
            "user_id": "1",
            "photo": "http://localhost/images//20160821.jpg",
            "nickname": "hong",
            "name": "홍길동",
        });
    }
});

module.exports = router;

