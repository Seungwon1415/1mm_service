var express = require('express');
var router = express.Router();
// TODO: 차단

router.post('/', function (req, res, next) {

    var blockedID = req.body.blockedID;

    res.send({
        message: "차단 되었습니다."
    });
});

module.exports = router;
