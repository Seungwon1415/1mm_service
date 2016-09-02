var dbPool = require('../models/common').dbPool;

// 회원 신고하는 함수
function insertReport(report, callback) {
    // 신고 당하는 사람을 테이블에 저장하는 쿼리
    var sql_insert_report = 'insert into report(reporter_id, suspect_id, content) values(?, ?, ?)';
    dbPool.getConnection(function (err, dbConn) {
        dbConn.query(sql_insert_report, [report.reportId, report.suspectId, report.contentNo], function (err, result) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}

module.exports.insertReport = insertReport;