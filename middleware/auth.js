const jwt = require('jsonwebtoken')
const User = require('../model/User')
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new ErrorResponse("Not Authorized to access this route",401))
    }
    try {
        const decode = jwt.verify(token, 'secret')
        const user = await User.findById(decode.id)
        if (!user) {
            return next(new ErrorResponse("No user found with this token",404))
        }
        req.user = user
        next()
    } catch (error) {
        return next(new ErrorResponse("Not Authorized to access this route",401))
    }
}