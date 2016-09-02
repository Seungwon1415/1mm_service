var async = require('async');
var fs = require('fs');
var path = require('path');
var dbPool = require('../models/common').dbPool;

// 유저가 존재하는지 찾는 함수
function findUser(id, callback) {
    var sql_search_user =
        "select id " +
        "from user " +
        "where id = ?";

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            dbConn.release();
            return callback(err);
        }
        dbConn.query(sql_search_user, [id], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            //유저를 찾았으면 그 results[0]의 id를 객체에 넣고 유저 객체 반환
            var user = {};
            user.id = results[0].id;

            callback(null, user);
        });
    });
}

// 유저를 찾거나 등록하는 함수
function findOrCreate(profile, callback) {
    console.log("find or create");

    //페이스북 profile을 이용해 내 회원을 찾는 쿼리
    var sql_search_id =
        "select id " +
        "from user " +
        "where auth_id = ?";

    //회원을 등록하는 쿼리
    var sql_insert_auth_info = "insert into user(auth_id, auth_type) values(?, ?)";

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql_search_id, [profile.id], function (err, results) {
            if (err) {
                dbConn.release();
                return callback(err);
            }
            //results.length가 0이 아니면 회원이 있다는 소리이므로 유제 객체를 반환
            if (results.length !== 0) {
                dbConn.release();
                var user = {};
                user.id = results[0].id;
                console.log(user);
                return callback(null, user);
            }

            //등록된 유저가 없으면 회원을 등록
            dbConn.query(sql_insert_auth_info, [profile.id, profile.provider], function (err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                }

                var user = {};
                user.id = result.insertId;

                return callback(null, user);
            });
        });
    });
}


// 검색 추천 연예인
function searchRecommend(callback) {
    // 최근에 가입한 연예인을 조회하는 쿼리
    var sql = 'SELECT id userId, name FROM user ORDER BY join_time DESC LIMIT 15';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    });
}

// 내 페이지 보기
function showMyInfo(id, callback) {
    // 내페이지 조회 쿼리
    var sql =
        'select u.id, u.nickname, u.name, u.photo, u.state_message, u.voice_message, u.following, u.follower,d.id donationId, d.name donationName ' +
        'from user u join donation d on(u.donation_id = d.id) ' +
        'where u.id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        // 파일을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
        dbConn.query(sql, [id], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            var photoPath = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";
            var voicePath = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/uservoice/";

            results[0].photo = photoPath + results[0].photo;
            results[0].voice_message = voicePath + results[0].voice_message;
            callback(null, results[0]);
        });
    });
}

// 상대방 페이지 보기
function showYourInfo(myId, yourId, callback) {
    console.log(myId, yourId);
    var followInfo; //상대방이 내가 팔로잉 했는 사람인지 아닌지 알기 위한 변수
    // 상대방 정보 조회하는 쿼리
    var sql =
        'select u.id, u.nickname, u.name, u.photo, u.state_message, u.voice_message, u.following, u.follower, d.id donationId, d.name donationName ' +
        'from user u join donation d on(u.donation_id = d.id) ' +
        'where u.id = ?';
    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        // 내가 팔로잉했는 사람인지 먼저 체크후 회원조회
        async.series([followCheck], function (err) {
            if (err) {
                return callback(err);
            }
            dbConn.query(sql, [yourId], function (err, results) {
                dbConn.release();
                if (err) {
                    return callback(err);
                }

                // 파일을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
                var photoPath = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";
                var voicePath = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/uservoice/";

                results[0].photo = photoPath + results[0].photo;
                results[0].voice_message = voicePath + results[0].voice_message;
                results[0].followInfo = followInfo;
                callback(null, results[0]);
            });
        });

        function followCheck(callback) {
            // 나와 팔로잉 인지 체크 하는 쿼리
            var sql =
                "select user_id " +
                "from following " +
                "where user_id = ? and following_id = ? ";

            dbConn.query(sql, [myId, yourId], function (err, results) {
                if (err) {
                    return callback(err);
                }
                if (results.length !== 0) {
                    return followInfo = 1;
                } else {
                    return followInfo = 0;
                }
            });
            callback(null);
        }
    });
}

// 팔로잉 추천

function recommendFollowing(callback) {
    //랜덤으로 회원 정보를 뽑는 쿼리
    var sql = 'SELECT id userId, name, photo FROM user WHERE celebrity =1 ORDER BY rand() LIMIT 12';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            // 사진을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
            async.each(results, function (item, callback) {
                var photoPath = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";
                item.photo = photoPath + item.photo;
                callback(null);
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                console.log(results);
                callback(null, results);
            });

        });
    });
}


// 기부랭킹
function donationRank(callback) {

    // 기부가격순이 높은 사람 5명을 뽑는 쿼리
    var sql =
        'SELECT u.id userId, u.name userName, u.photo userPhoto, d.id donationId, d.name donationName, d.photo donationPhoto ' +
        'from question q join user u on (u.id = q.answerner_id) ' +
        'join donation d on (d.id = u.donation_id) ' +
        'where u.celebrity = 1 ' +
        'group by u.name ' +
        'order by sum(price) desc limit 5 ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            // 사진을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
            async.each(results, function (item, callback) {
                var photoPath = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";
                item.userPhoto = photoPath + item.userPhoto;
                callback(null);
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                console.log(results);
                callback(null, results);
            });
        });
    });
}


// 프로필 수정하는 함수
function updateProfile(profile, callback) {
    console.log(profile);

    // 음성 파일이 있는지 없는지 체크하는 쿼리
    var sql_select_voice_message =
        'select voice_message ' +
        'from user ' +
        'where id = ?';

    // 프로필 수정하는 쿼리
    var sql_update_profile =
        'update user ' +
        'set nickname = ?, name = ?, state_message = ?, voice_message = ? ' +
        'where id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        // 프로필을 select해서 있는지 없는지 확인
        dbConn.query(sql_select_voice_message, [profile.id], function (err, results) {
            if (err) {
                dbConn.release();
                return callback(err);
            }

            // 파일이 없으면 프로필 수정
            if (results[0].voice_message === null) {
                modifyProfile(function (err) {
                    if (err) {
                        dbConn.release();
                        return callback(err);
                    }
                    dbConn.release();
                    callback(null);
                });
            } else { // 파일이 있으면 프로필 수정하고 기존의 파일 삭제
                dbConn.beginTransaction(function (err) {
                    if (err) {
                        dbConn.release();
                        return callback(err);
                    }
                    async.series([modifyProfile, deleteOriginalFile], function (err, results) {
                        if (err) {
                            //에러가 있으면 롤백
                            return dbConn.rollback(function () {
                                dbConn.release();
                                callback(err);
                            });
                        }
                        //에러가 없으면 커밋
                        dbConn.commit(function () {
                            callback(null);
                            dbConn.release();
                        });
                    });
                });
            }

            // 프로필 수정 함수
            function modifyProfile(done) {
                console.log(profile.voice_message);
                console.log(profile.id);
                dbConn.query(sql_update_profile, [profile.nickname, profile.name, profile.state_message, profile.voice_message, profile.id], function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    done(null);
                });
            }

            // 경로에 있는 사진 삭제
            function deleteOriginalFile(done) {
                if (err) {
                    return done(err);
                }
                var filePath = path.join(__dirname, '../uploads/users/voice/');
                // 실제 경로를 찾아줘서 삭제
                fs.unlink(path.join(filePath, results[0].voice_message), function (err) {
                    if (err) {
                        return done(err);
                    }
                    done(null);
                });
            }
        });
    });
}


// 프로필 사진을 수정하는 함수
function updatePhoto(newPhoto, callback) {
    console.log(newPhoto.photo);

    //사진이 있는지 없는지 확인하는 쿼리
    var sql_select_photo =
        'select photo ' +
        'from user ' +
        'where id = ?';

    // 사진을 업데이트 하는 쿼리
    var sql_update_photo =
        'update user ' +
        'set photo = ? ' +
        'where id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql_select_photo, [newPhoto.id], function (err, results) {
            if (err) {
                dbConn.release();
                return callback(err);
            }

            // 사진 데이터를 셀렉해서 없으면 수정
            if (results[0].photo === null) {
                modifyPhoto(function (err) {
                    if (err) {
                        dbConn.release();
                        return callback(err);
                    }
                    dbConn.release();
                    callback(null);
                });
            } else { // 사진이 있으면 수정하고 기존의 파일 삭제
                dbConn.beginTransaction(function (err) {
                    if (err) {
                        dbConn.release();
                        return callback(err);
                    }
                    async.series([modifyPhoto, deleteOriginalFile], function (err, results) {
                        if (err) {
                            // 에러가 있으면 롤백
                            return dbConn.rollback(function () {
                                dbConn.release();
                                callback(err);
                            });
                        }
                        //에러가 없으면 커밋
                        dbConn.commit(function () {
                            callback(null);
                            dbConn.release();
                        });
                    });
                });
            }

            // 프로필 수정
            function modifyPhoto(done) {
                dbConn.query(sql_update_photo, [newPhoto.photo, newPhoto.id], function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    done(null);
                });
            }

            // 기존의 파일 삭제하는 함수
            function deleteOriginalFile(done) {
                if (err) {
                    return done(err);
                }
                var filePath = path.join(__dirname, '../uploads/users/photos');
                // 실제 경로를 찾아줘서 삭제
                fs.unlink(path.join(filePath, results[0].photo), function (err) {
                    if (err) {
                        return done(err);
                    }
                    done(null);
                });
            }
        });
    });
}

// 프로필 사진 삭제 하는 함수
function deletePhoto(id, callback) {
    // 프로필 사진 셀렉
    var sql_search_photo =
        'select photo ' +
        'from user ' +
        'where id = ?';

    // 삭제하기 위해 null으로 업데이트 하는 쿼리
    var sql_delete_photo =
        'update user ' +
        'set photo = null ' +
        'where id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql_search_photo, [id], function (err, results) {
            if (err) {
                dbConn.release();
                return callback(err);
            }
            // 셀렉한 사진이 없으면 삭제 할것이 없다고 말해줌
            if (results[0].photo === null) {
                dbConn.release();
                return callback(null, 0); //0은 삭제할 사진이 없다는걸 의미
            }

            // 삭제할 사진이 있으면 null으로 수정하고 기존의 파일을 삭제
            dbConn.beginTransaction(function (err) {
                if (err) {
                    dbConn.release();
                    return callback(err);
                }
                async.series([modifyPhoto, deleteOriginalFile], function (err, results) {
                    if (err) {
                        return dbConn.rollback(function () {
                            dbConn.release();
                            callback(err);
                        });
                    }
                    dbConn.commit(function () {
                        dbConn.release();
                        callback(null, 1); // 1은 파일이 있어서 삭제한다는 의미
                    });
                });

                function modifyPhoto(done) {
                    dbConn.query(sql_delete_photo, [id], function (err, result) {
                        if (err) {
                            return done(err);
                        }
                        done(null);
                    });
                }

                // 기존의 파일을 삭제하는 함수
                function deleteOriginalFile(done) {
                    if (err) {
                        return done(err);
                    }
                    var filePath = path.join(__dirname, '../uploads/users/photos');
                    // 실제 경로를 찾아줘서 삭제
                    fs.unlink(path.join(filePath, results[0].photo), function (err) {
                        if (err) {
                            return done(err);
                        }
                        done(null);
                    });
                }
            });
        });
    });
}

function updateDonation(id, donationId, callback) {
    var sql_update_donation =
        'update user ' +
        'set donation_id = ? ' +
        'where id = ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql_update_donation, [donationId, id], function (err, result) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}


function searchUser(word, pageNo, count, callback) {
    var queryWord = '%' + word + '%';

    var sql_search_word =
        'select id, photo, nickname, name, celebrity ' +
        'from user ' +
        'where nickname like ? or name like ? ' +
        'limit ?,?';

    dbPool.getConnection(function (err, dbConn) {
        dbConn.query(sql_search_word, [queryWord, queryWord, count * (pageNo - 1), count], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }


            async.each(results, function (item, callback) {
                var userphotos = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";

                item.photo = userphotos + item.photo;
                callback(null);
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, results);
            });
        });
    });
}


module.exports.showMyInfo = showMyInfo;
module.exports.showYourInfo = showYourInfo;
module.exports.findUser = findUser;
module.exports.findOrCreate = findOrCreate;
module.exports.searchRecommend = searchRecommend;
module.exports.recommendFollowing = recommendFollowing;
module.exports.donationRank = donationRank;
module.exports.updateProfile = updateProfile;
module.exports.updatePhoto = updatePhoto;
module.exports.deletePhoto = deletePhoto;
module.exports.updateDonation = updateDonation;
module.exports.searchUser = searchUser;