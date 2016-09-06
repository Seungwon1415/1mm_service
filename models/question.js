var mysql = require('mysql');
var async = require('async');
var dbPool = require('../models/common').dbPool;

// 인기질문 리스트 - 나도 듣기 순
function listenCountTop10(id, callback) {

    // 인기 질문을 나도 듣기 순으로 뽑아오는 쿼리
    var sql = 'select * from ' +
        '(SELECT q.id questionId, u.id questionerId, us.id answernerId, u.photo questionerPhoto, us.photo answernerPhoto, q.content questionContent, q.price, a.listening_count listenCount, a.length ' +
        'FROM question q join answer a on(q.id = a.question_id) ' +
        'JOIN user u on(u.id =q.questioner_id) ' +
        'JOIN user us on(us.id =q.answerner_id) ' +
        'ORDER BY a.listening_count desc LIMIT 10)a ' +
        'left outer join (select a.question_id payInfo ' +
        'from pay p join answer a on (p.answer_id = a.id) ' +
        'where p.user_id = ?)b ' +
        'on(a.questionId = b.payInfo) ';

    var userphotos = process.env.HTTP_HOST + "/userphotos/";
    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, [id], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            async.each(results, function (item, done) {
                if (typeof item.payInfo === 'number') {
                    item.payInfo = '1';
                }
                else {
                    item.payInfo = '0';
                }

                item.questionerPhoto = userphotos + item.questionerPhoto;
                item.answernerPhoto = userphotos + item.answernerPhoto;

                done(null);
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, results);

            });
        });
    });
}

// 인기질문 리스트 - 가격 순
function priceTop10(id, callback) {

    var sql = 'select * from ' +
        '(SELECT q.id questionId, u.id questionerId, us.id answernerId, u.photo questionerPhoto, us.photo answernerPhoto, q.content questionContent, q.price, a.listening_count listenCount, a.length ' +
        'FROM question q join answer a on(q.id = a.question_id) ' +
        'JOIN user u on(u.id =q.questioner_id) ' +
        'JOIN user us on(us.id =q.answerner_id) ' +
        'ORDER BY q.price desc LIMIT 10)a ' +
        'left outer join (select a.question_id payInfo ' +
        'from pay p join answer a on (p.answer_id = a.id) ' +
        'where p.user_id = ?)b ' +
        'on(a.questionId = b.payInfo) ';

    var userphotos = process.env.HTTP_HOST + "/userphotos/";
    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, [id], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            async.each(results, function (item, done) {
                if (typeof item.payInfo === 'number') {
                    item.payInfo = '1';
                }
                else {
                    item.payInfo = '0';
                }

                item.questionerPhoto = userphotos + item.questionerPhoto;
                item.answernerPhoto = userphotos + item.answernerPhoto;

                done(null);
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, results);
            });
        });
    });
}

// 질문하기
function registerQuestion(newQuestion, callback) {
    var sql_insert_question =
        'insert into question(questioner_id, answerner_id, price, date, content) values(?, ?, ?, ?, ?)';
    dbPool.getConnection(function (err, dbConn) {
        dbConn.query(sql_insert_question, [newQuestion.questionerId, newQuestion.answernerId, newQuestion.price, newQuestion.date, newQuestion.content], function (err, result) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
    });
}



module.exports.listenCountTop10 = listenCountTop10;
module.exports.priceTop10 = priceTop10;
module.exports.registerQuestion = registerQuestion;
