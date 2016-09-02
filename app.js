var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var redis = require('redis');
var redisClient =redis.createClient();
var RedisStore = require('connect-redis')(session);


var question = require('./routes/question');
var user = require('./routes/user');
var block = require('./routes/block');
var donation = require('./routes/donation');
var follow = require('./routes/follow');
var report = require('./routes/report');
var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new RedisStore({
    host: "127.0.0.1",
    port: 6379,
    client: redisClient,
  }),
  resave: true,                     // 변경된것이 없으면 세션을 저장하지 않는다.(변경있을때만 resave)
  saveUninitialized: false          // 저장된것이 없으면 세션을 생성하지 않는다.
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./routes/common').isAuthenticated); //모든 요청이 있는 곳에 인증을 요구
app.use('/uservoice', express.static(path.join(__dirname, 'uploads/users/voice')));
app.use('/userphotos', express.static(path.join(__dirname, 'uploads/users/photos')));
app.use('/donationphotos', express.static(path.join(__dirname, 'uploads/donations/photos')));
app.use('/answervoice', express.static(path.join(__dirname, 'uploads/answer/voice')));


app.use('/questions', question);
app.use('/users', user);
app.use('/reports', report);
app.use('/blocks', block);
app.use('/donations', donation);
app.use('/follows', follow);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to models
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
