const User = require("../models/user")
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


exports.signup = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    };

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "Not able to save User"
            })
        }
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    };

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not exist"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email or Pasword is Incorrect"
            })
        }
        //create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)

        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send response to frontend
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    });
};


exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User Signout Successfully"
    });
}

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});


//custom middlewares

exports.isAuthenticated = (req, res, next) => {
    // console.log(`auth ${auth}`);
    console.log(`req.profile ${req.profile}`);
    console.log(`req.auth ${req.auth}`);
    console.log(`req.profile._id ${req.profile._id}`);
    console.log(`req.auth._id ${req.auth._id}`);


    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not Admin"
        });
    }
    next();
}