import {User} from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {transporter} from '../config/nodemailer.js';

// signup 

export const signup = async (req, res) => {
    try{

        // get data from request body
        const {name, email, password} = req.body;

        // check if values exist

        if (!email || !password) {
            return res.status(400).json({success: false, message: "email and password are required"})
        }

        // check if user already exist in our system
        const ifuserexist = await User.findOne({email: email});
        if(ifuserexist){
            return res.status(400).json({success: false, message: "user already exists"})
        }

        // encrypting password

        const encryptedPassword = await bcrypt.hash(password, 10);

        // create new user in our system

        const newUser = await User.create({
            name,
            email: email,
            password: encryptedPassword
        });

        newUser.save();

        // generate token 

        const token = jwt.sign(
            {_id:newUser._id},
            "key",
            {expiresIn: "7d"}
        )

        return res.status(201).json({success: true, message: "user created successfully", token: token})


    }catch(err){
        return res.status(500).json({error: err.message, message: "error while signing up"})
    }
}


// send verification otp


export const sendVerificationOtp = async (req, res) => {
    try{

        // finding user
        
        const user = await User.findOne({_id: req.decoded._id});


        // check if user already exist
        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        // check if user is already verified
        if(user.isVerified){
            return res.status(400).json({message: "user already verified"});
        }


        // generate opt

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;

        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        await user.save();

        // send otp to user email

        await transporter.sendMail({
            from: 'jahangeer9182@gmail.com',
            to: user.email,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`
        });

        return res.status(200).json({success: true, message: "OTP sent successfully"});

    }catch(err){
        return res.status(500).json({error: err.message, message: "error while sending otp"})
    }
}


// verify otp

export const verifyOtp = async (req, res) => {
    try{


        // get value from request body
        const {otp} = req.body;

        // finding user
        const user = await User.findOne({_id: req.decoded._id});

        // check if user already exist
        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        // check if user is already verified
        if(user.isVerified){
            return res.status(400).json({message: "user already verified"});
        }

        // check if otp is correct
        if(user.otp !== otp){
            return res.status(400).json({message: "invalid otp"});
        }

        // check if otp is expired
        if(user.otpExpiry < Date.now()){
            return res.status(400).json({message: "otp expired"});
        }

        // mark user as verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).json({success: true, message: "user verified successfully"});

    }catch(err){
        return res.status(500).json({error: err.message, message: "error while verifying otp"})
    }

}


export const login = async (req, res) => {
    try{

        // get data from request body
        const {email, password} = req.body;

        // check if values exist
        if (!email || !password) {
            return res.status(400).json({message: "email and password are required"})
        }

        // check if user exist 

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        // check if user is verified
        if(!user.isVerified){
            return res.status(400).json({message: "verify your account first"});
        }


        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "invalid password"});
        }

        // generate token

             // generate token 

        const token = jwt.sign(
            {_id:user._id},
            "key",
            {expiresIn: "7d"}
        )

        return res.status(200).json({success: true, message: "logged in successfully", token: token})


    }catch(err){
        return res.status(500).json({error: err.message, message: "error while logging in"})
    }
}


// send reset password otp

export const sendResetOtp = async (req,res)=>{
    try{

        // get email from request body
        const {email} = req.body;

        // check if value exist
        if (!email) {
            return res.status(400).json({message: "email is required"})
        }

        // checking if user already exist

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        // generate otp

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetotp = otp;

        user.resetotpExpiry = Date.now() + 10 * 60 * 1000;
    
        await user.save();

        // send otp to user email

        await transporter.sendMail({
            from: 'jahangeer9182@gmail.com',
            to:user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
        });


        return res.status(200).json({success: true, message: "reset otp sent successfully"});

    }catch(err){
        return res.status(503).json({error: err.message, message: "Unable to send reset OTP. Check the Gmail app password in config/nodemailer.js."})
    }
}

// verify reset otp

export const verifyResetOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({ message: "otp and email are required" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        if (user.resetotp !== otp.toString()) {
            return res.status(400).json({ message: "invalid otp" });
        }

        if (user.resetotpExpiry < Date.now()) {
            return res.status(400).json({ message: "otp expired" });
        }

        user.isresetotpverified = true;
        user.resetotp = null;
        user.resetotpExpiry = null;

        await user.save();

        return res.status(200).json({ success: true, message: "reset otp verified successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message, message: "error while verifying reset otp" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newpassword, newPassword } = req.body;
        const passwordValue = newPassword || newpassword;

        if (!email || !passwordValue) {
            return res.status(400).json({ message: "email and new password are required" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        if (!user.isresetotpverified) {
            return res.status(400).json({ message: "verify your otp first" });
        }

        const encryptedNewPassword = await bcrypt.hash(passwordValue, 10);

        user.password = encryptedNewPassword;
        user.isresetotpverified = false;

        await user.save();

        return res.status(200).json({ success: true, message: "password reset successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message, message: "error while resetting password" });
    }
};

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.decoded._id).select('-password -otp -resetotp -otpExpiry -resetotpExpiry -isresetotpverified');
        if (!user) return res.status(404).json({ success: false, message: 'user not found' });
        return res.status(200).json({ success: true, userData: user });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'error while getting user data' });
    }
};

export const isAuth = (req, res) => res.status(200).json({ success: true });