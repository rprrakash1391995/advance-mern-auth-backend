const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[true,'Please provide a username']
    },
    email: {
        type: String,
        required: [true, 'Please provide a Email'],
        unique:true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minlength:5,
        select:false,
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date
})

userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next()
})

userSchema.methods.getSignedToken = function() {
    return jwt.sign({id:this._id}, 'secret', {expiresIn:"2h"})
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken
}

const User = mongoose.model('User', userSchema)
module.exports = User