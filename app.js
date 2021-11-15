var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { decodeToken, cekUser } = require('./app/auth/middleware');

const productRouter = require('./app/product/router');
const authRouter = require('./app/auth/router');

var app = express();

app.use(logger('dev'));
app.use(decodeToken());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api/products', cekUser(), productRouter);

// catch 404 and forward to error handler
app.get('*', function(req, res){
    res.status(404).json({
        'error':1,
        'message': 'Requested resource does\'t exist'
    }); // <== YOUR JSON DATA HERE
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
