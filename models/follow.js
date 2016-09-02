var mysql = require('mysql');
var async = require('async');
var dbPool = require('../models/common').dbPool;


// 내 팔로잉 목록 조회
function myFollowing(id, pageNo, count, callback) {
    //팔로잉 목록 조회 쿼리
    var sql = 'SELECT f.following_id userId, u.photo, u.nickname, u.name, u.celebrity, f.distance ' +
        'From following f JOIN user u ON(u.id = f.following_id) ' +
        'JOIN user us on(us.id = f.user_id) ' +
        'WHERE f.user_id = ? ' +
        'LIMIT ?, ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, [id, (pageNo - 1) * count, count], function (err, results) {
            dbConn.release();
            if (err) {
                return (callback);
            }
            // 사진을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
            async.each(results, function(item, callback) {
                var userphotos = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";

                item.photo = userphotos + item.photo;
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

// 내 팔로워 목록 조회
function myfollower(id, pageNo, count, callback) {
    //내 팔로워 목록을 조회하는 쿼리
    var sql_followerList = 'SELECT f.user_id userId, us.photo, us.nickname, us.name, us.celebrity ' +
        'FROM following f JOIN user u ON(u.id = f.following_id) ' +
        'JOIN user us ON(us.id = f.user_id) ' +
        'WHERE f.following_id = ? ' +
        'LIMIT ?, ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql_followerList, [id, (pageNo - 1) * count, count], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            // 내 팔로워중에 내가 팔로잉 했는 사람인지 알기위해 followInfo property 추가
            async.each(results, function(item, callback) {
                item.followInfo = 0;
            }, function(err) {
                if(err) {
                    return callback(err);
                }
            });

            // 내 팔로잉을 찾아오는 함수
            searchMyFollowing(function(err, followingResults) {
                // 내 팔로우 결과와 내 팔로잉 결과를 비교
                // 팔로우중 내 팔로잉이 있으면 followInfo에 1을 넣고 저장
                async.each(results,function(item1, cb) {
                    async.each(followingResults,function(item2, cb2) {
                        if(item1.followInfo === 0) {
                            if(item1.userId === item2.following_id) {
                                item1.followInfo = 1;
                            }
                        }
                        cb2(null);
                    },function(err) {
                        if(err) {
                            return cb(err);
                        }
                        cb(null);
                    });
                }, function(err) {
                    if (err){
                        return callback(err);
                    }

                    // 사진을 전송 해줄때 내 파일 저장 경로를 같이 붙여서 뿌려줌
                    async.each(results, function(item, callback) {
                        var userphotos = "http://ec2-52-78-158-195.ap-northeast-2.compute.amazonaws.com:8080/userphotos/";

                        item.photo = userphotos + item.photo;
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

            function searchMyFollowing(callback) {
                var sql_searchMyFollowing = 'SELECT following_id From following WHERE following.user_id = ? ';
                dbConn.query(sql_searchMyFollowing, [id], function (err, results) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            }
        });
    });
}



// TODO: 상대방 팔로잉 목록

function yourFollowing(id, pageNo, count, callback) {
    var sql = 'SELECT f.following_id userId, u.photo, u.nickname, u.name, u.celebrity, f.distance ' +
        'From following f JOIN user u ON(u.id = f.following_id) ' +
        'JOIN user us on(us.id = f.user_id) ' +
        'WHERE f.user_id = ? ' +
        'LIMIT ?, ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql, [id, (pageNo - 1) * count, count], function (err, results) {
            dbConn.release();
            if (err) {
                return (callback);
            }
            callback(null, results);
        });
    });
}

// TODO: 상대방 팔로워 목록

function yourFollower(id, pageNo, count, callback) {
    var sql_followerList = 'SELECT f.user_id userId, us.photo, us.nickname, us.name, us.celebrity ' +
        'FROM following f JOIN user u ON(u.id = f.following_id) ' +
        'JOIN user us ON(us.id = f.user_id) ' +
        'WHERE f.following_id = ? ' +
        'LIMIT ?, ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        dbConn.query(sql_followerList, [id, (pageNo - 1) * count, count], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err);
            }
            async.each(results, function(item, callback) {
                item.followInfo = 0;
            }, function(err) {
                if(err) {
                    return callback(err);
                }
            });

            searchMyFollowing(function(err, followingResults) {

                async.each(results,function(item1, cb) {
                    async.each(followingResults,function(item2, cb2) {
                        if(item1.followInfo === 0) {
                            if(item1.userId === item2.following_id) {
                                item1.followInfo = 1;
                            }
                        }
                        cb2(null);
                    },function(err) {
                        if(err) {
                            return cb(err);
                        }
                        cb(null);
                    });
                }, function(err) {
                    if (err){
                        return callback(err);
                    }

                    callback(null, results);
                });
            });

            function searchMyFollowing(callback) {
                var sql_searchMyFollowing = 'SELECT following_id From following WHERE following.user_id = ? ';
                dbConn.query(sql_searchMyFollowing, [id], function (err, results) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, results);
                });
            }
        });
    });
}


module.exports.myFollowing = myFollowing;
module.exports.myFollower = myfollower;
module.exports.yourFollowing = yourFollowing;
module.exports.yourFollower = yourFollower;