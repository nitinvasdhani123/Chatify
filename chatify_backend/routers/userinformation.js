const express = require('express');
const user = require('../controller/userinformation')
const userrouter = express.Router()
const conversation = require('../controller/conversation')

// create/add user to database
userrouter.post('/',user.createuser)
userrouter.post('/verify-signup-otp', user.verifySignupOTP)
userrouter.post('/login',user.verifyuser)
userrouter.post('/forget-password',user.forgetPassword)
userrouter.post('/verify-forget-password-otp', user.verifyForgetPasswordOTP)
userrouter.post('/reset-password', user.verifyResetPassword)

userrouter.get('/getLoginUserDetail' , user.getLoginUserDetail)
userrouter.get('/getAllUserDetailOtherThanLoginUser' , user.getAllUserDetailOtherThanLoginUser)
userrouter.patch('/LoginUserDetailUpdate' , user.LoginUserDetailUpdate)
userrouter.post('/getSearchUserDetail' , user.getSearchUserDetail)
userrouter.patch('/SearchUserStatusUpdate' , user.SearchUserStatusUpdate)
userrouter.get('/getUserDetailsWhichIsClick' , user.getUserDetailsWhichIsClick)


userrouter.post('/addconversations',conversation.addconversations)
userrouter.get('/getallconversations/:sender_id/:receiver_id',conversation.getallconversations)

// in future  when we will add last message shown functionality using this below route
userrouter.get('/getlatestconversations/:sender_id/:receiver_id',conversation.getlatestconversations)


exports.userrouter = userrouter