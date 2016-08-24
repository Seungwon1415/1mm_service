var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path')
// TODO: 팔로잉 추천, 검색

router.get('/', function (req, res, next) {

    if (req.query.celebrity) {
        res.send({
            user_id: "2" ,
            photo: "http://localhost/images//20160821.jpg",
            nickname: "hong",
            name: "홍길동"
        });
    }
    if (req.query.word) {
        res.send({
            user_id: "1",
            photo: "http://localhost/images//20160821.jpg",
            nickname: "hong",
            name: "홍길동"
        });
    }
});


// TODO: 추천 스타 리스트

router.get('/Top15', function (req, res, next) {
    res.send({
        user_id: "1",
        name: "홍길동"
    });
});


// TODO: 상대방 페이지

router.get('/:id', function (req, res, next) {
    res.send({
        user_id: "1",
        nickname: "hong",
        name: "이승원",
        photo: "http://localhost/images/20160821.jpg",
        state_message: "안녕하세요.",
        voice_message: "http://localhost/voice/20160821.mp3",
        following: "133",
        follower: "50",
        donation_name: "유니세프"

    });
});

// TODO: 기부랭킹

router.get('/donationRank10', function (req, res, next) {
    res.send({
        user_id: "1",
        nickname: "hong",
        name: "이승원",
        photo: "http://localhost/images/20160821.jpg",
        donation_id: "1",
        donation_name: "유니세프",
        donation_photo: "http://localhost/images/20160821s.jpg"
    });
});

// TODO: 프로필 수정


router.put('/me', function (req, res, next) {
    /*    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads/images');
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {

        if (err) {
            return next(err);
        }
*/
        var newProfile = {};
        newProfile.nickname = req.body.nickname;
        newProfile.name = req.body.name;
        newProfile.photo = req.body.photo;
        newProfile.state_message = req.body.state_message;
        newProfile.voice_message = req.body.voice_message;
        newProfile.account_num = req.body.account_num;
        newProfile.bank_name = req.body.bank_name;
        newProfile.donation_id = req.body.donation_id;

   /*     newProfile.files = [];

        newProfile.files.push({
            path: files.photos.path,
            name: files.photos.name
        });

    });*/
    res.send({
        message: "프로필 수정을 하였습니다."
    });
});




// TODO: 프로필 등록

router.post('/me', function (req, res, next) {
    var Profile = {};
    Profile.nickname = req.body.nickname;
    Profile.name = req.body.name;
    Profile.state_message = req.body.state_message;
    Profile.voice_message = req.body.voice_message;


    res.send({
        message: "프로필을 등록 하였습니다."
    });
});
module.exports = router;
