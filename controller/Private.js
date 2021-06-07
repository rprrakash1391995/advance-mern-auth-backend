const ErrorResponse = require('../utils/errorResponse')


exports.getPrivateData = (req, res, next) => {
    res.status(200).json({
        success: true,
        data:"successfully  authorized"
    })
}