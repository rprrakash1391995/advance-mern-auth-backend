const express = require('express')
const router = express.Router()
const { getPrivateData } = require('../controller/Private')
const {protect}  = require('../middleware/auth')

router.route('/private').get(protect,getPrivateData)

module.exports = router 