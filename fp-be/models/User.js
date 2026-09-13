import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    otp:{
        type: String,
        default: null
    },
    otpExpiry:{
        type:Number,
        default: null
    },
    resetotp:{
        type: String,
        default: null
    },
    resetotpExpiry:{
        type:Number,
        default: null
    },
    isresetotpverified:{
        type: Boolean,
        default: false
    }

},{timestamps: true});

export const User = mongoose.model('User', userSchema);