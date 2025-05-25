const  userSignController = require('../controller/userSign')
const { isUserAuthorized } = require('../Middleware/userAuthorization')

const express = require('express')
const userAuth = express.Router()

userAuth.post('/user/sign-Up',userSignController.userSignUp)
userAuth.post('/user/sign-In',userSignController.userSignIn)
userAuth.get('/auth/check',isUserAuthorized)
userAuth.get('/auth/logout',userSignController.userSignOut)


exports.userAuth = userAuth;