var async = require('async');
var dbPool = require('./common').dbPool;

// 기부처 조회 함수
function listDonation(pageNo, count, callback) {
    // 기부처 테이블에서 조회하는 쿼리
    var sql_search_donation =
        'select id donationId, name, photo, description ' +
        'from donation ' +
        'limit ?,?';

    dbPool.getConnection(function (err, dbConn) {
        dbConn.query(sql_search_donation, [count * (pageNo - 1), count], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            // 사진을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
            async.each(results, function(item, callback) {
                var donationphotos = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/donationphotos/";

                item.photo = donationphotos + item.photo;

                callback(null);
            },function(err) {
                if (err) {
                    return callback(err);
                }
                console.log(results);
                callback(null, results);
            });
        });
    });
}

module.exports.listDonation = listDonation;