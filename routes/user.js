var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var async = require('async');
var User = require('../models/user');

// 팔로잉 랜덤 추천, 기부랭킹, 검색 추천 연예인, 검색

router.get('/', function (req, res, next) {
    var category = parseInt(req.query.category, 10);
    console.log(category);
    if (category === 0) { // category 0일경우 팔로잉 추천
        User.recommendFollowing(function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                message: '팔로잉 추천',
                result: results
            });
        });
    } else if (category === 1) { // category 1일경우 검색 연예인 추천
        User.searchRecommend(function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                message: '검색 추천 연예인',
                result: results
            });
        });
    } else if (category === 2) { // category 2일경우 기부랭킹
        User.donationRank(function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                message: '기부랭킹',
                result: results
            });
        });
    } else if (req.query.word) { // 쿼리에 word가 들어가면 검색 진입

        var word = req.query.word;
        var pageNo = parseInt(req.query.pageNo, 10);
        var count = parseInt(req.query.count, 10);

        // 검색단어를 가지고 검색하는 함수
        User.searchUser(word, pageNo, count, function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                message: '사용자 검색',
                result: results
            });
        });

    } else {
        res.send({
            result: "쿼리가 틀렸습니다."
        });
    }
});


// 상대방 & 내  페이지 조회
router.get('/:id', function (req, res, next) {
    if (req.params.id === 'me') { // 동적 파라미터로 me가 들어오면 내 정보를 조회
        var id = req.user.id;
        User.showMyInfo(id, function (err, results) {
            if (err) {
                return next(err);
            }
            res.send({
                result: results
            });
        });
    } else { // 동적 파라미터로 회원 id가 들어오면 회원 정보를 조회
        var myId = req.user.id;
        var yourId = parseInt(req.params.id);

        User.showYourInfo(myId, yourId, function (err, results) {
            res.send({
                result: results
            });
        });
    }
});

// 프로필 수정
// 0 = 프로필 수정, 1 = photo 수정 삭제, 2 = donation 수정
router.put('/me', function (req, res, next) {

    var id = req.user.id;
    var type = parseInt(req.query.type, 10);

    if (type === 0) { // 0일 경우 프로필 수정
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../uploads/users/voice');
        form.keepExtensions = true;
        form.multiples = true;

        form.parse(req, function (err, fields, files) {
            if (err) {
                return next(err);
            }
            var newProfile = {};
            newProfile.id = id;
            newProfile.nickname = fields.nickname;
            newProfile.name = fields.name;
            newProfile.state_message = fields.state_message;
            newProfile.voice_message = path.basename(files.voice_message.path); //voice_message는 file이기 때문에 basename을 저장

            console.log(newProfile.voice_message);
            User.updateProfile(newProfile, function (err) {
                if (err) {
                    return next(err);
                }
                res.send({
                    result: "프로필 수정을 완료하였습니다."
                });
            });
        });
    } else if (type === 1) { // 1일 경우 프로필 사진만 수정
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../uploads/users/photos');
        form.keepExtensions = true;
        form.multiples = true;

        form.parse(req, function (err, fields, files) {
            if (err) {
                return next(err);
            }
            var newPhoto = {};
            newPhoto.id = id;

            if(files.photo) { // 파일이 있으면 사진을 등록
                newPhoto.photo = path.basename(files.photo.path); // file의 basename만 저장해서 넘김
                User.updatePhoto(newPhoto, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.send({
                        result: "사진 수정을 완료하였습니다."
                    });
                });
            }

            if(fields.photo) { // 파일이 없으면 사진을 삭제
                User.deletePhoto(id, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    if (result === 0) { //원래 사진이 없을때
                        res.send({
                            result: "삭제할 사진이 없습니다."
                        });
                    } else { //사진을 삭제 하였을때
                        res.send({
                            result: "사진을 삭제 하였습니다."
                        });
                    }
                });
            }
        });
    } else if (type === 2) { // 2일경우 기부처 수정
        var donationId = parseInt(req.body.donationId, 10);
        User.updateDonation(id, donationId, function (err, result){
            if(err) {
                return next(err);
            }
            res.send({
                result: "프로필 기부처 수정을 완료 하였습니다."
            });
        });
    }
});


module.exports = router;

