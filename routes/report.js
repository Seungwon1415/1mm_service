var express = require('express');
var router = express.Router();
// TODO: 신고

router.post('/', function (req, res, next) {

    var suspectID = req.body.suspectID;

    res.send({
        message: "신고 되었습니다."
    });
});

module.exports = router;




