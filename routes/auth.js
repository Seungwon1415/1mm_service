var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
var User = require('../models/user');

passport.serializeUser(function (id, done) {
    done(null, id);
});

passport.deserializeUser(function (id, done) {
    User.findUser(id, function (err, user) {
        if (err) {
            return done(err);
        }
        done(null, user);
    });
});

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, function (accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    User.findOrCreate(profile, function (err, id) {
        if (err) {
            return done(err);
        }
        return done(null, id);
    });
}));

router.get('/local/logout', function (req, res, next) {
    req.logout();
    res.send({message: 'local logout'});
});

router.post('/facebook/token', passport.authenticate('facebook-token'), function (req, res, next) {
    if (req.user) {
        res.send({
            message: "인증에 성공 하였습니다."
        });
    } else {
        res.send({
            message: "인증에 실패 하였습니다."
        });
    }
});



module.exports = router;