const User = require('../user/model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { getToken } = require('./middleware');

async function register(req, res, next) {
    console.log(req.body)
    try {

        const payload = req.body;

        let user = new User(payload);

        await user.save();

        return res.json(user);
    } catch (err) {

        // (1) cek kemungkinan kesalahan terkait validasi
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        // (2) error lainnya 
        next(err);
    }
}

async function localStrategy(email, password, done) {
    try {
        let user = await User.findOne({ email }).select('-__v -createdAt -updatedAt -token');

        if (!user) return done();

        if (bcrypt.compareSync(password, user.password)) {
            ({ password, ...userWithoutPassword } = user.toJSON());

            // (4) akhiri pengecekkan, user berhasil login 
            // berikan data user tanpa password
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null) // <--- tangani error 
    }
    done();
}
async function login(req, res, next) {
    passport.authenticate('local', async function (err, user) {

        if (err) return next(err);

        if (!user) return res.json({ error: 1, message: 'email or password incorrect' })

        // (1) buat JSON Web Token
        let signed = jwt.sign(user, config.secretKey);

        // (2) simpan token tersebut ke user terkait
        await User.findOneAndUpdate({ _id: user._id }, { $push: { token: signed } }, { new: true });

        // (3) response ke _client_ 
        return res.json({
            message: 'logged in successfully',
            user: user,
            token: signed
        });

    })(req, res, next);
}

function me(req, res, next) {
    // return res.json(req.user);
    if (!req.user) {
        return res.status(401).json({
            error: 1,
            message: `Your're not login or token expired`
        });
    }

    return res.json(req.user);
}

async function logout(req, res, next) {

    let token = getToken(req);

    let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token } }, { useFindAndModify: false });

    if (!user || !token) {
        return res.json({
            error: 1,
            message: 'User tidak ditemukan'
        });
    }

    // --- logout berhasil ---//

    return res.json({
        error: 0,
        message: 'Logout berhasil'
    });
}

module.exports = {
    register,
    localStrategy,
    login,
    me,
    logout
}