var async = require('async');
var dbPool = require('../models/common').dbPool;

function insertBlock(blockingId, blockedId, callback) {
    // 차단테이블에 등록하는 쿼리
    var sql_insert_block = 'insert into block(blocking_id, blocked_id) values(?, ?)';
    dbPool.getConnection(function (err, dbConn) {
        dbConn.query(sql_insert_block, [blockingId, blockedId], function (err, result) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}

module.exports.insertBlock = insertBlock;