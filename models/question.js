var mysql = require('mysql');
var async = require('async');
var dbPool = require('../models/common').dbPool;


// 인기질문 리스트 - 나도 듣기 순
function listenCountTop10(callback) {

    // 인기 질문을 나도 듣기 순으로 뽑아오는 쿼리
    var sql = 'SELECT u.id questionerId, us.id answernerId, u.photo questionerPhoto, us.photo answernerPhoto, q.content questionContent, a.voice_content voiceContent, q.price, a.listening_count listenCount, a.length ' +
        'FROM question q join answer a on(q.id = a.question_num) ' +
        'join user u on(u.id =q.questioner_id) ' +
        'join user us on(us.id =q.answerner_id) ' +
        'order by a.listening_count desc ' +
        'limit 10';

    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, function(err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            // 파일을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
            async.each(results, function(item, callback) {
                var answerVoicePath = "https://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:4433/answervoice/";
                var userPhotoPath = "https://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:4433/userphotos/";

                item.voiceContent = answerVoicePath + item.voiceContent;
                item.questionerPhoto = userPhotoPath + item.questionerPhoto;
                item.answernerPhoto = userPhotoPath + item.answernerPhoto;
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

// 인기질문 리스트 - 가격 순
function priceTop10(callback) {

    // 인기 질문을 가격 순으로 뽑아오는 쿼리
    var sql = 'SELECT u.id questionerId, us.id answernerId, u.photo questionerPhoto, us.photo answernerPhoto, q.content questionerContent, a.voice_content voiceContent, q.price, a.listening_count listenCount, a.length ' +
        'FROM question q join answer a on(q.id =a.question_num) ' +
        'join user u on(u.id = q.questioner_id) ' +
        'join user us on(us.id = q.answerner_id) ' +
        'order by q.price desc ' +
        'limit 10';
    dbPool.getConnection(function(err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, function(err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            // 파일을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
            async.each(results, function(item, callback) {
                var answervoice = "https://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:4433/answervoice/";
                var userphotos = "https://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:4433/userphotos/";

                item.voiceContent = answervoice + item.voiceContent;
                item.questionerPhoto = userphotos + item.questionerPhoto;
                item.answernerPhoto = userphotos + item.answernerPhoto;
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

module.exports.listenCountTop10 = listenCountTop10;
module.exports.priceTop10 = priceTop10;