var express = require('express');
var router = express.Router();
var isSecure = require('./common').isSecure;

router.get('/', isSecure, function (req, res, next) {

    // 6. 팔로우 질문 리스트
    if (req.url.match(/\/\?direction=to&celebrity=true&pageNo=\d+&count=\d+/i)) {
        res.send({
            message: "6. 팔로우 질문 리스트",
            result: [{
                Q_id: "1",
                A_id: "2",
                Q_photo: "http://localhost/images/123.jpg",
                Q_content: "질문내용",
                price: "10000",
                A_photo: "http://localhost/images/456.jpg",
                voice_content: "http://localhost/voice/20160821.mp3",
                listen_count: "103040",
                length: "35"
            }]
        });
    }

    // 11. 질문한 목록 to
    if (req.url.match(/\/\?direction=to&id=.*&pageNo=\d+&count=\d+/i)) {
        var id;
        if (req.query.id === 'me') {
            id = 'me';
        } else {
            id = parseInt(req.query.id, 10);
        }
        console.log(id);
        res.send({
            message: "질문한 목록 to",
            result: [{
                Q_id: "1",
                A_id: "2",
                Q_photo: "http://localhost/images/123.jpg",
                Q_content: "질문내용",
                price: "10000",
                A_photo: "http://localhost/images/456.jpg",
                voice_content: "http://localhost/voice/20160821.mp3",
                listen_count: "103040",
                length: "35"
            }]
        });
    }
    // 11. 질문받은 목록 from
    if (req.url.match(/\/\?direction=from&id=.*&pageNo=\d+&count=\d+/i)) {
        var id;
        if (req.query.id === 'me') {
            id = 'me';
        } else {
            id = parseInt(req.query.id, 10);
        }
        if (req.query.id === 'me') {
        }
        res.send({
            message: " 질문받은 목록 from",
            result: [{
                Q_id: "1",
                A_id: "2",
                Q_photo: "http://localhost/images/123.jpg",
                Q_content: "질문내용",
                price: "10000",
                A_photo: "http://localhost/images/456.jpg",
                voice_content: "http://localhost/voice/20160821.mp3",
                listen_count: "103040",
                length: "35"
            }]
        });
    }
});
//hh
// 13. 인기 질문 리스트
router.get('/popular10', isSecure, function (req, res, next) {
    res.send({
        message: "13. 인기 질문 리스트",
        result: [{
            Q_id: "1",
            A_id: "2",
            Q_photo: "http://localhost/images/123.jpg",
            Q_content: "질문내용",
            price: "10000",
            A_photo: "http://localhost/images/456.jpg",
            voice_content: "http://localhost/voice/20160821.mp3",
            listen_count: "103040",
            length: "35",
            dfdf: 'test'
        }]
    });
});


// 10. 질문하기
router.post('/', function (req, res, next) {
    var newQuestion = {};
    newQuestion.price = req.body.price;
    newQuestion.date = req.body.date;
    newQuestion.content = req.body.content;
    newQuestion.responsor_id = req.body.responsor_id;

    res.send({
        message: "질문이 등록 되었습니다."
    });
});


module.exports = router;