import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendRestOtp, sendVerifyOtp, verifyEmail } from '../Controllers/authController.js';
import userAuth from '../middlewear/userauth.js';

export const authRouter = express.Router(); // Correct named export

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendRestOtp);
authRouter.post('/resetPassword',resetPassword);
