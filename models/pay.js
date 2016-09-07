var dbPool = require('../models/common').dbPool;
var async = require('async');

function payAnswerListening(listeningPay, callback) {

    dbPool.getConnection(function (err, dbConn) {
        dbConn.beginTransaction(function (err) {
            if (err) {
                return callback(err);
            }
            async.parallel([insertPay, updateMyPoint, updateYourPoint], function (err) {
                dbConn.release();
                if (err) {
                    return dbConn.rollback(function () {
                        callback(err);
                    });
                }
                dbConn.commit(function () {
                    callback(null, listeningPay);
                });
            });
        });
        function insertPay(callback) {
            var sql_insert_pay = 'insert into pay(user_id, answer_id, date) values (?, ?, str_to_date(?, \'%Y-%m-%dT%H:%i:%s\')) ';
            dbConn.query(sql_insert_pay, [listeningPay.id, listeningPay.answerId, listeningPay.date], function (err, result) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        }

        function updateMyPoint(callback) {
            var sql_update_my_point = 'update user set point = (point - 200), listening_cost = (listening_cost + 200) where id = ? ';
            dbConn.query(sql_update_my_point, [listeningPay.id], function (err, result) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        }

        function updateYourPoint(callback) {
            var sql_update_your_point = 'update user set point = (point +200), listening_profit = (listening_profit + 200) where id = ? ';
            dbConn.query(sql_update_your_point, [listeningPay.answerId], function (err, result) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        }
    });
}


module.exports.payAnswerListening = payAnswerListening;