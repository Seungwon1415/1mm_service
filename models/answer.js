var async = require('async');
var dbPool = require('../models/common').dbPool;

function registerAnswer(newAnswer, callback) {

    console.log(newAnswer);
    dbPool.getConnection(function (err, dbConn) {
        dbConn.beginTransaction(function (err) {
            if (err) {
                return callback(err);
            }

            async.series([insertAnswer, updateQuestionCost, deleteTransmission], function (err) {
                if (err) {
                    return dbConn.rollback(function () {
                        dbConn.release();
                        callback(err);
                    });
                }

                dbConn.commit(function () {
                    dbConn.release();
                    callback(null);
                });
            });
        });

        function insertAnswer(done) {
            var sql_insert_answer =
                'insert into answer(question_id, date, length, voice_content) values(?, ?, ?, ?)';
            dbConn.query(sql_insert_answer, [newAnswer.questionId, newAnswer.date, newAnswer.length, newAnswer.voiceContent], function (err, result) {
                if (err) {
                    return callback(err);
                }
                done(null);
            });
        }

        function updateQuestionCost(done) {
            var sql_insert_qCost =
                'update user ' +
                'set question_cost = question_cost + ((select price from question where id = 2) * 0.4) ' +
                'where id = (select questioner_id ' +
                'from question ' +
                'where id = ?) ';

            dbConn.query(sql_insert_qCost, [newAnswer.questionId], function (err, result) {
                if (err) {
                    return callback(err);
                }
                done(null);
            });
        }

        function deleteTransmission(done) {
            var sql_delete_trans =
                'delete from transmission ' +
                'where user_id = ? and question_id = ? ';

            dbConn.query(sql_delete_trans, [newAnswer.myId, newAnswer.questionId], function (err, reuslt) {
                if (err) {
                    return callback(err);
                }
                done(null);
            });
        }
    });
}

module.exports.registerAnswer = registerAnswer;