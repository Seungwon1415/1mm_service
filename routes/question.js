var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

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
    

    // 11. 나의 질문 목록 to (내가 질문한 목록)
    if (req.url.match(/\/\?direction=to&pageNo=\d+&count=\d+/i)) {
        res.send({
            message: "11. 나의 질문 목록 to (내가 질문한 목록)",
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

    // 11. 나의 질문 목록 from (내가 받은 질문 목록)
    if (req.url.match(/\/\?direction=from&pageNo=\d+&count=\d+/i)) {
        res.send({
            message: "11. 나의 질문 목록 from (내가 받은 질문 목록)",
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

    // 12. 상대방 질문 목록 to (상대방이 질문한 목록)
    if (req.url.match(/\/\?direction=to&id=\d+&pageNo=\d+&count=\d+/i)) {
        res.send({
            message: "12. 상대방 질문 목록 to (상대방이 질문한 목록)",
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
    // 12. 상대방 질문 목록 to (상대방이 질문 받은 목록)
    if (req.url.match(/\/\?direction=from&id=\d+&pageNo=\d+&count=\d+/i)) {
        res.send({
            message: "12. 상대방 질문 목록 from (상대방이 질문 받은 목록)",
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

// 13. 인기 질문 리스트
router.get('/popular10', function (req, res, next) {

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
            length: "35"
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
    })
});


module.exports = router;
