var express = require('express');
var router = express.Router();
var Report = require('../models/report');

// 회원 신고
router.post('/', function (req, res, next) {
    var report = {};
    report.reportId = req.user.id;
    report.suspectId = parseInt(req.body.suspectId, 10);
    report.contentNo = parseInt(req.body.contentNo, 10);

    Report.registerReport(report, function(err, result) {
        if (err) {
            return next(err);
        }
        res.send({
            message: "신고 되었습니다."
        });
    });
});

module.exports = router;




