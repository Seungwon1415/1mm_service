var express = require('express');
var router = express.Router();
var Answer = require('../models/answer');
var formidable = require('formidable');
var path = require('path');

router.post('/', function (req, res, next) {

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads/answer/voices');
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        }

        var newAnswer = {};
        newAnswer.myId = req.user.id;
        newAnswer.questionId = parseInt(fields.questionId, 10);
        newAnswer.date = fields.date;
        newAnswer.length = parseInt(fields.length, 10);
        newAnswer.voiceContent = path.basename(files.voiceContent.path); //voice_message는 file이기 때문에 basename을 저장

        Answer.registerAnswer(newAnswer, function (err) {
            if (err) {
                return next(err);
            }

            res.send({
                result: "답변 등록을 완료 하였습니다."
            });
        });
    });

});

module.exports = router;