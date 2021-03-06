
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator/check');

exports.postSignIn = (req,res,next) => {
    const email = req.body.email;
    const pass = req.body.password;

    

    User.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.json({
                    status: 400,
                    message: 'Invalid password or email*'
                });
            }

            bcrypt.compare(pass, user.password)
            .then(matched => {
                if (matched) {
                    return res.json({
                        status: 200,
                        message: '',
                        user: user
                    });
                }
                return res.json({
                    status: 400,
                    message: 'Invalid password or email',
                });
            });
        })
        .catch (err => {
            res.json({
                status: 400,
                message: err,
            });
        })
}

exports.postSignUp = (req,res,next) => {
    const email = req.body.email;
    const pass = req.body.password;
    const confPass = req.body.confirmPassword;
    const name = req.body.username;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            status: 422,
            message: errors.array()[0].msg
        });
    }

    if (pass !== confPass) {
        return res.json({
            status: 400,
            message: 'Passwords does not match',
        });
    }

    bcrypt.hash(pass,12)
        .then(hashedPassword => {
            const newUser = new User({
                username: name,
                password: hashedPassword,
                email: email
            });
            return newUser.save();
        })
        .then(result => {
            res.json({
                status: 200,
                message: 'User Created',
            });
        }) 
        .catch(err => {
            res.json({
                status: 403,
                message: err,
            });
        })

    
}