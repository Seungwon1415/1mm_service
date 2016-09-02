var express = require('express');
var router = express.Router();
var isSecure = require('./common').isSecure;
var Question = require('../models/question');

router.get('/', isSecure, function (req, res, next) {

    var pageNo = parseInt(req.query.pageNo, 10);
    var count = parseInt(req.query.count, 10);
    var answer = parseInt(req.query.answer,10);

    // TODO: 내 페이지 질문 목록 조회

    if (answer === 0) {
        if (req.query.direction === 'to') {
            res.send({
                result: [{
                    questionerId: "1",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    questionerContent: "질문내용"
                }]
            });
        }

        if (req.query.direction === 'from') {
            res.send({
                result: [{
                    questionerId: "1",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    questionerContent: "질문내용"
                }]
            });
        }
    }
    else if (answer === 1) {
        if (req.query.direction === 'to') {
            res.send({
                result: [{
                    questionerId: "1",
                    answernerId: "2",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    answernerPhoto: "http://localhost/images/456.jpg",
                    questionerContent: "질문내용",
                    price: "10000",
                    voiceContent: "http://localhost/voice/20160821.mp3",
                    listenCount: "103040",
                    length: "35",
                    payInfo: "1"
                }]
            });
        }

        if (req.query.direction === 'from') {
            res.send({
                result: [{
                    questionerId: "1",
                    answernerId: "2",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    questionerContent: "질문내용",
                    price: "10000",
                    answernerPhoto: "http://localhost/images/456.jpg",
                    voiceContent: "http://localhost/voice/20160821.mp3",
                    listenCount: "103040",
                    length: "35",
                    payInfo: "1"

                }]
            });
        }
    }
    else if(answer === 2) {
        res.send({
            result: [{
                questionerId: "1",
                answernerId: "2",
                questionerPhoto: "http://localhost/images/123.jpg",
                questionerContent: "질문내용",
                price: "10000",
                answernerPhoto: "http://localhost/images/456.jpg",
                voiceContent: "http://localhost/voice/20160821.mp3",
                listenCount: "103040",
                length: "35",
                payInfo: "1"
            }]
        });
    }
    // TODO: 팔로잉 질문 리스트
    else {
        res.send({
            result:[{
                questionerId: "1",
                answernerId: "2",
                questionerPhoto: "http://localhost/images/123.jpg",
                questionerContent: "질문내용",
                price: "10000",
                answernerPhoto: "http://localhost/images/456.jpg",
                voiceContent: "http://localhost/voice/20160821.mp3",
                listenCount: "103040",
                length: "35"
            }]
        });
    }
});

// 인기 질문 리스트
router.get('/popular10', isSecure, function (req, res, next) {
    var type = parseInt(req.query.type, 10);

    // 나도듣기 순 top 10
    if (type === 0) { // type = 0 이면 나도듣기순으로 인기질문 조회
        Question.listenCountTop10(function(err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        })
    }
    // 높은 가격 순 top10
    if (type === 1) { // type = 1 이면 가격순으로 인기질문 조회
        Question.priceTop10(function(err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        })

    }
});

// TODO: 상대방 페이지 질문 목록
router.get('/:id', function(req,res,next) {
    var pageNo = parseInt(req.query.pageNo, 10);
    var count = parseInt(req.query.count, 10);
    var answer = parseInt(req.query.answer, 10);

    if(req.query.direction === 'to') {
        if (answer === 0) {
            res.send({
                result: [{
                    "questionerId": "1",
                    "questionerPhoto": "http://localhost/images/123.jpg",
                    "questionerContent": "질문내용"
                }]
            });
        }
        else if(answer === 1) {
            res.send({
                result:[{
                    questionerId: "1",
                    answernerId: "2",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    answernerPhoto: "http://localhost/images/456.jpg",
                    questionerContent: "질문내용",
                    price: "10000",
                    voiceContent: "http://localhost/voice/20160821.mp3",
                    listenCount: "103040",
                    length: "35"

                }]
            })
        }
    }
    else if(req.query.direction === 'from') {
        if(answer === 0) {
            res.send({
                result:[{
                    questionerId: "1",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    questionerContent: "질문내용"
                }]
            });
        }
        else if(answer === 1) {
            res.send({
                result:[{
                    questionerId: "1",
                    answernerId: "2",
                    questionerPhoto: "http://localhost/images/123.jpg",
                    questionerContent: "질문내용",
                    price: "10000",
                    answernerPhoto: "http://localhost/images/456.jpg",
                    voiceContent: "http://localhost/voice/20160821.mp3",
                    listenCount: "103040",
                    length: "35",
                    date: "2016-08-24"
                }]
            });
        }
    }
});

module.exports = router;