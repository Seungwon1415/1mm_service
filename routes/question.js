var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    // 8. 팔로우 질문 리스트
    if (req.query.direction && req.query.celebrity) {
        console.log("zzz");
        res.send({
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

    // 11. 나의 질문 목록
    if (req.query.direction) {
        if (req.query.direction === 'to') {
            res.send({
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

        if (req.query.direction === 'from') {
            res.send({
                result: [{
                    Q_id: "3",
                    A_id: "4",
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
    }
    */
    console.log("ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ");
});

module.exports = router;
