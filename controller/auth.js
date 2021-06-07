const crypto = require('crypto')
const User = require('../model/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendMail')

exports.register = async (req, res,next) => {
    const { username, email, password } = req.body
    try {
        const user = await User.create({ username, email, password })
        // await user.save()
       sendToken(user,201,res)
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res,next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return next(new ErrorResponse("Please Provide an Email and Password",400))
        }
        const user = await User.findOne({email}).select("+password")
        if (!user) {
         return next(new ErrorResponse("Invalid Credentials",401))
        }
        const ismatch = await user.matchPasswords(password)
        if (!ismatch) {
         return next(new ErrorResponse("Invalid Credentials",401))
        }

        sendToken(user,200,res)

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:error.message
        })
    }
}

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return next(new ErrorResponse("Email could not sent", 401))
        }
        const resetToken = user.getResetPasswordToken()
        await user.save()
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`
        const message = `
              <h1>You have requested a password reset</h1>
              <p>Please make a put request to the following link:</p>
              <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
              `
          try {
              await sendEmail({
                  to: user.email,
                  subject: "password reset request",
                  text:message
              })
              res.status(200).json({
                  success: true,
                  data:"email sent"
              })
          } catch (error) {
              user.resetPasswordToken = undefined
              user.resetPasswordExpire = undefined
              await user.save()
              return next(new ErrorResponse("email coul not be send",500))
          }
    } catch (error) {
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest("hex")
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt : Date.now()}
        })
        if (!user) {
            return next(new ErrorResponse("Invalid reset token",400))
        }
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()

        res.status(200).json({
            success: true,
            data:"password reset success"
        })
    } catch (error) {
        next(error)
    }
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({success:true,token})
}