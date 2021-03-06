const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../user/model');

function getToken(req) {
    let token =
        req.headers.authorization
            ? req.headers.authorization.replace('Bearer ', '')
            : null;

    return token && token.length ? token : null;

}

function decodeToken() {
    return async function (req, res, next) {
        try {

            let token = getToken(req);

            if (!token) return next();

            req.user = jwt.verify(token, config.secretKey);

            let user = await User.findOne({ token: { $in: [token] } }) // <---

            if (!user) {
                return res.json({
                    error: 1,
                    message: `Token expired`
                });
            }
        } catch (err) {
            if (err && err.name === 'JsonWebTokenError') {
                return res.json({
                    error: 1,
                    message: err.message
                });
            }

            // (2) tangani error lainnya 
            next(err);
        }
        return next();
    }
}

function cekUser() {
    return async function (req,res,next){
        if (!req.user) {
            return res.status(401).json({
                error: 1,
                message: `Your're not login or token expired`
            });
        }
        return next();
    }
}

module.exports = {
    decodeToken,
    cekUser,
    getToken
}